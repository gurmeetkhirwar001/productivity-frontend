import React, { useState, useCallback, useEffect } from "react";
import { Button } from "components/ui";
import CommonCalendar from "../CommonCalendar";
import { gapi } from "gapi-script";
import useCloud from "utils/hooks/useCloud";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const scopes = "https://www.googleapis.com/auth/calendar";
export default function GoogleCalendar() {
  const [isLoading, setIsLoadingGoogleDriveApi] = useState(false);
  const [SignedinUser, setSignedInUser] = useState(null);
  const [files, setFiles] = useState([]);
  console.log(SignedinUser);
  const { CalendarConnection } = useCloud();
  console.log(
    "apiKey:",
    process.env.REACT_APP_NODE_ENV == "dev"
      ? process.env.REACT_APP_GOOGLE_DEV_API_KEY
      : process.env.REACT_APP_API_KEY,
    "  clientId:",
    process.env.REACT_APP_NODE_ENV == "dev"
      ? process.env.REACT_APP_GOOGLE_DEV_CLIENT_ID
      : process.env.REACT_APP_CLIENT_ID
  );
  const initClient = useCallback(() => {
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

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {
          console.log(error);
        }
      );
  });
  const handleClientLoad = async () => {
    await gapi.load("client:auth2", initClient);
  };
  const updateSigninStatus = useCallback((isSignedIn) => {
    console.log(isSignedIn);
    if (isSignedIn) {
      // Set the signed in user
      localStorage.setItem(
        "gcalendartoken",
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
      if (localStorage.getItem("gcalendartoken")) {
        await gapi.load("client", initClient);
      }
      //   updateSigninStatus(SignedinUser);
      if (localStorage.getItem("gcalendartoken")) {
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
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
      })
      .then(async function (response) {
        // setIsFetchingGoogleDriveFiles(false);
        // setListDocumentsVisibility(true);
        let events = response.result.items.map((ite) => {
          return {
            start: ite.start.dateTime,
            end: ite.end.dateTime,
            title: ite.summary,
          };
        });
        console.log(events);

        const res = JSON.parse(response.body);
        setFiles(events);
        let token = gapi.auth2.getAuthInstance().currentUser.le.xc.id_token;
        if (localStorage.getItem("gcalendartoken") == null) {
          await CalendarConnection(
            { token, events: res.files },
            "calendar",
            "googlecalendar"
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
    localStorage.removeItem("gcalendartoken");
    gapi.auth2.getAuthInstance().signOut();
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Google Calendar</h1>
        {/* {SignedinUser} */}
        <Button
          variant="solid"
          onClick={() =>
            localStorage.getItem("gcalendartoken") == undefined
              ? handleClientLoad()
              : handleSignOutClick()
          }
        >
          {localStorage.getItem("gcalendartoken") == undefined
            ? "Connect Google Calendar"
            : "Disconnect Calendar"}
        </Button>
      </div>
      <div className="mt-4">
        <CommonCalendar event={files} />
      </div>
    </>
  );
}
