/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "components/ui";
import { gapi } from "gapi-script";
import DriveFiles from "./driveFiles";
import useCloud from "utils/hooks/useCloud";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const scopes = "https://www.googleapis.com/auth/drive";
export default function GoogleDriveFetch() {
  const [isLoading, setIsLoadingGoogleDriveApi] = useState(false);
  const [SignedinUser, setSignedInUser] = useState(null);
  const [files, setFiles] = useState([]);
  console.log(SignedinUser);
  const { CloudConnection } = useCloud();
  const initClient = () => {
    setIsLoadingGoogleDriveApi(true);
    gapi.client
      .init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: scopes,
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          // gapi.setAccessToken(
          //   gapi.auth2.getAuthInstance().currentUser.le.xc.id_token
          // );

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {}
      );
  };
  const handleClientLoad = async () => {
    await gapi.load("client:auth2", initClient);
    await gapi.client.setToken({
      access_token: gapi.auth2.getAuthInstance().currentUser.le.xc.id_token,
    });
  };
  const updateSigninStatus = useCallback((isSignedIn) => {
    console.log(isSignedIn);
    if (isSignedIn) {
      // Set the signed in user
      localStorage.setItem(
        "gdrivetoken",
        gapi.auth2.getAuthInstance().currentUser.le.xc.id_token
      );
      console.log(gapi.auth2.getAuthInstance().currentUser.le.xc.id_token);
      setSignedInUser(gapi.auth2.getAuthInstance().isSignedIn.get());
      setIsLoadingGoogleDriveApi(false);
      // list files if user is authenticated
      listFiles();
    } else {
      // prompt user to sign in
      handleAuthClick();
    }
  });
  useEffect(() => {
    async function InitateDrive() {
      //   await gapi.load("client:auth2", initClient)

      if (localStorage.getItem("gdrivetoken")) {
        await gapi.load("client", initClient);
      }
      //   updateSigninStatus(SignedinUser);

      listFiles();
    }
    InitateDrive();
    // eslint-disable-next-line no-use-before-define
  }, []);
  /**
   * List files.
   */
  const listFiles = (searchTerm = null) => {
    // setIsFetchingGoogleDriveFiles(true);
    gapi.client.drive.files
      .list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime)",
        q: searchTerm,
      })
      .then(async function (response) {
        // setIsFetchingGoogleDriveFiles(false);
        // setListDocumentsVisibility(true);
        const res = JSON.parse(response.body);
        setFiles(res.files);
        let token = localStorage.getItem("gdrivetoken");
        await CloudConnection(
          { token, files: res.files },
          "cloud",
          "googledrive"
        );
        // setDocuments(res.files);
      });
  };

  /**
   *  Sign in the user upon button click.
   */
  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = (event) => {
    // setListDocumentsVisibility(false);
    localStorage.removeItem("gdrivetoken");
    gapi.auth2.getAuthInstance().signOut();
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Google Drive</h1>
        {SignedinUser}
        <Button
          variant="solid"
          onClick={() =>
            localStorage.getItem("gdrivetoken")
              ? handleSignOutClick()
              : handleClientLoad()
          }
        >
          {localStorage.getItem("gdrivetoken")
            ? "Disconnect"
            : "Connect Google Drive"}
        </Button>
      </div>
      <div className="mt-4">
        <DriveFiles data={files} className="lg:col-span-3" />
        {/* {files.map((file) => (
          <li>{file.name}</li>
        ))} */}
      </div>
    </>
  );
}
