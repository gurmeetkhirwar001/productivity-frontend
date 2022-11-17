import React, { useState, useCallback, useEffect } from "react";
import { Button } from "components/ui";
import CommonCalendar from "../CommonCalendar";
import { gapi } from "gapi-script";
import useCloud from "utils/hooks/useCloud";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const scopes = "https://www.googleapis.com/auth/drive";
export default function GoogleCalendar() {
  const [isLoading, setIsLoadingGoogleDriveApi] = useState(false);
  const [SignedinUser, setSignedInUser] = useState(null);
  const [files, setFiles] = useState([]);
  console.log(SignedinUser);
  const { CloudConnection } = useCloud();
  const initClient = useCallback(() => {
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

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {}
      );
  });
  const handleClientLoad = async () => {
    await gapi.load("client:auth2", initClient);
  };
  const updateSigninStatus = useCallback((isSignedIn) => {
    console.log(isSignedIn);
    if (isSignedIn) {
      // Set the signed in user
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
      await handleClientLoad();
      //   updateSigninStatus(SignedinUser);
      if (SignedinUser) {
        listFiles();
      }
    }
    InitateDrive();
    // eslint-disable-next-line no-use-before-define
  }, [SignedinUser]);
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
        let token = gapi.auth2.getAuthInstance().currentUser.le.xc.id_token;
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
    gapi.auth2.getAuthInstance().signOut();
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Google Calendar</h1>
        {/* {SignedinUser} */}
        <Button variant="solid">Connect Google Calendar</Button>
      </div>
      <div className="mt-4">
        <CommonCalendar />
      </div>
    </>
  );
}
