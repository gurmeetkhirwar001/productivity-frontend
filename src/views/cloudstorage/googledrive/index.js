/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Alert, Button } from "components/ui";
import { gapi } from "gapi-script";
import DriveFiles from "./driveFiles";
import useCloud from "utils/hooks/useCloud";
import axios from "axios";
import { UploadDropBoxFiles } from "services/CloudStorageService";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const scopes = "https://www.googleapis.com/auth/drive";
export default function GoogleDriveFetch() {
  const [isLoading, setIsLoadingGoogleDriveApi] = useState(false);
  const [SignedinUser, setSignedInUser] = useState(null);
  const [initate, setInitate] = useState(false)
  const [files, setFiles] = useState([]);
  console.log(SignedinUser);
  const [open, setOpen] = useState(false);

  const { CloudConnection } = useCloud();
  const initClient = () => {
    // setIsLoadingGoogleDriveApi(true);
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
          setInitate(false)
        },
        function (error) {}
      );
  };
  const handleClientLoad = async () => {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
  
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'client_id': process.env.REACT_APP_NODE_ENV == "prod"? process.env.REACT_APP_CLIENT_ID: process.env.REACT_APP_GOOGLE_DEV_CLIENT_ID,
                  'redirect_uri': window.location.href,
                  'response_type': 'token',
                  'scope': 'https://www.googleapis.com/auth/drive',
                  'include_granted_scopes': 'true',
                  'state': 'pass-through value'};
                  console.log(window.location.href)
  
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };
  const updateSigninStatus = useCallback((isSignedIn) => {
    console.log(isSignedIn);
    setSignedInUser(isSignedIn)
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
      if(initate == true){

        handleAuthClick();
      }
    }
  });
  useEffect(() => {
    async function InitateDrive() {
      //   await gapi.load("client:auth2", initClient)
if(window.location.href.includes("access_token")){
  const acc=window.location.href.split('&')[1].split("=")[1]
  localStorage.setItem("gdrivetoken",acc)
  setSignedInUser(true)
  // window.location.href = window.location.href.split("#")[0]
  // gapi.client.setAccessToken(
  //   acc
  //   );

}
      //   updateSigninStatus(SignedinUser);
listFiles()
    }
    InitateDrive();
    // eslint-disable-next-line no-use-before-define
  }, [SignedinUser]);
  /**
   * List files.
   */
  const listFiles = (searchTerm = null) => {
    // setIsFetchingGoogleDriveFiles(true);
   axios.get('https://www.googleapis.com/drive/v3/files',{
    headers:{
      Authorization: `Bearer ${localStorage.getItem('gdrivetoken')}`
    }
   })
      .then(async function (response) {
        // setIsFetchingGoogleDriveFiles(false);
        // setListDocumentsVisibility(true);
        console.log(response.data.files)
        // const res = JSON.parse(response.body);
        setFiles(response.data.files);
        let token = localStorage.getItem("gdrivetoken");
        await CloudConnection(
          { token, files: response.data.files },
          "cloud",
          "googledrive"
        );
        // setDocuments(res.files);
      });
  };
  const UploadFiles = (files) => {
    let file = files;
      const form = new FormData();

      form.append(
        "metadata",
        new Blob(
          [
            JSON.stringify({
              name: file[0].name,
              mimeType: file[0].type,
            }),
          ],
          { type: "application/json" }
        )
      );
      form.append("file", file[0]);

      fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=name,webViewLink,id,mimeType",
        {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + localStorage.getItem("gdrivetoken"),
          }),
          body: form,
        }
      )
      .then((res) => {
        setOpen(!open);
        listFiles();
      });
  };
  const downloadFiles = (fileId) => {
    gapi.client.drive.files
      .get({
        fileId: fileId,
        alt: "media",
      })
      .then((res) => {
        console.log(res);
      });
  };
  /**
   *  Sign in the user upon button click.
   */
  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = (event) => {
    console.log("logout")
    // setListDocumentsVisibility(false);
    localStorage.removeItem("gdrivetoken");
   setSignedInUser(false)
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Google Drive</h1>
        {console.log(SignedinUser,"SignedinUser")}
        <Button
          variant="solid"
          onClick={() =>
     localStorage.getItem('gdrivetoken')
              ? handleSignOutClick()
              : handleClientLoad()
          }
        >
          {     localStorage.getItem('gdrivetoken')


            ? "Disconnect"
            : "Connect Google Drive"}
        </Button>
      </div>
      <div className="mt-4">
        <DriveFiles
          data={files}
          className="lg:col-span-3"
          UploadFiles={UploadFiles}
          setOpen={setOpen}
          open={open}
          downloadFiles={downloadFiles}
        />
        {/* {files.map((file) => (
          <li>{file.name}</li>
        ))} */}
      </div>
    </>
  );
}
