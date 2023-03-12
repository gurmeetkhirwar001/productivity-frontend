/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "components/ui";
import { gapi } from "gapi-script";
import GmailMails from "./maillist";
import useCloud from "utils/hooks/useCloud";
import axios from "axios"
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
];
const scopes = "https://mail.google.com/";
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
        apiKey:
          process.env.REACT_APP_NODE_ENV == "dev"
            ? process.env.REACT_APP_GOOGLE_DEV_API_KEY
            : process.env.REACT_APP_API_KEY,
        clientId:
          process.env.REACT_APP_NODE_ENV == "dev"
            ? process.env.REACT_APP_GOOGLE_DEV_CLIENT_ID
            : process.env.REACT_APP_CLIENT_ID,
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
    
      var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
      // Create <form> element to submit parameters to OAuth 2.0 endpoint.
      var form = document.createElement('form');
      form.setAttribute('method', 'GET'); // Send as a GET request.
      form.setAttribute('action', oauth2Endpoint);
    
      // Parameters to pass to OAuth 2.0 endpoint.
      var params = {'client_id': process.env.REACT_APP_NODE_ENV == "prod"? process.env.REACT_APP_CLIENT_ID: process.env.REACT_APP_GOOGLE_DEV_CLIENT_ID,
                    'redirect_uri': window.location.href,
                    'response_type': 'token',
                    'scope': 'https://mail.google.com',
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
    if (isSignedIn) {
      // Set the signed in user
      localStorage.setItem(
        "gmailtoken",
        gapi.auth2.getAuthInstance().currentUser.le.xc.id_token
      );
      console.log(gapi.auth2.getAuthInstance().currentUser.le.xc.id_token);
      setSignedInUser(gapi.auth2.getAuthInstance().isSignedIn.get());
      setIsLoadingGoogleDriveApi(false);
      // list files if user is authenticated
      listFiles();
    } else {
      // prompt user to sign in
      setSignedInUser(false)
    }
  });
  useEffect(() => {
    async function InitateDrive() {
      //   await gapi.load("client:auth2", initClient)

      if(window.location.href.includes("access_token")){
        const acc=window.location.href.split('&')[1].split("=")[1]
        localStorage.setItem("gmailtoken",acc)
        setSignedInUser(true)
        // window.location.href = window.location.href.split("#")[0]
        // gapi.client.setAccessToken(
        //   acc
        //   );
      
      }
        listFiles();
        if(localStorage.getItem("gmailtoken")){
          setSignedInUser(true)
        }
        // setSignedInUser(true)
    }
    InitateDrive();
    // eslint-disable-next-line no-use-before-define
  }, [SignedinUser]);
  /**
   * List files.
   */
  const listFiles = async (searchTerm = null) => {
    // setIsFetchingGoogleDriveFiles(true);
    // const response = await gapi.client.gmail.users.labels.list({
    //   userId: "me",
    // });
    axios.get('https://gmail.googleapis.com/gmail/v1/users/me/threads',{
    headers:{
      Authorization: `Bearer ${localStorage.getItem('gmailtoken')}`
    }
   })
      .then(async function (response) {
        // setIsFetchingGoogleDriveFiles(false);
        // setListDocumentsVisibility(true);
        // const res = JSON.parse(response.body);
        setFiles(response.data.threads);
        let token = localStorage.getItem("gmailtoken");
        if (token == undefined) {
          await CloudConnection(
            { token, files: response.data.threads },
            "cloud",
            "googledrive"
          );
        }
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
    localStorage.removeItem("gmailtoken");
    // gapi.auth2.getAuthInstance().signOut();
    setSignedInUser(false)
    setFiles([])
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Gmail Important Mails</h1>
        {SignedinUser}
        <Button
          variant="solid"
          onClick={() =>
            SignedinUser == true
              ? handleSignOutClick()
              : handleClientLoad()
          }
        >
          {SignedinUser == true
            ? "Disconnect Gmail"
            : "Connect Gmail"}
        </Button>
      </div>
      <div className="mt-4">
        <GmailMails data={files || []} className="lg:col-span-3" />
        {/* {files.map((file) => (
          <li>{file.name}</li>
        ))} */}
      </div>
    </>
  );
}
