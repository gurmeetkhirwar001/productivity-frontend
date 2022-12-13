import React, { useState, useEffect } from "react";
import { Button } from "components/ui";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { CalendarRequest } from "views/auth/Azure/authconfig";
import AzureConnector from "utils/AzureWrapper";
import { msalConfig } from "../../auth/Azure/authconfig";
import useCloud from "../../../utils/hooks/useCloud";
import { PublicClientApplication } from "@azure/msal-browser";
import {
  CloudConnect,
  GetOneDriveCalendarEvents,
} from "services/CloudStorageService";
import CommonCalendar from "../CommonCalendar";
// import OneDriveFiles from "./onedrivefiles";
import { useSelector } from "react-redux";
export default function OutlookCalendar() {
  const msalInstance = new PublicClientApplication(msalConfig);
  const Authenticated = useIsAuthenticated();
  const CloudFiles = useSelector((state) => state.cloud.CloudSlice);
  const { HandleCalendarEvent, CalendarConnection } = useCloud();
  useEffect(() => {
    let driveToken = localStorage.getItem("onecalendartoken");
    SetData(driveToken);
  }, []);
  const SetData = async (token, idToken) => {
    const response = await GetOneDriveCalendarEvents(token);
    // console.log(response.data);
    HandleCalendarEvent(response.data.value);
    console.log(token, idToken);
    if (idToken) {
      CalendarConnection(
        { token: idToken, files: response.data.value },
        "cloud",
        "Azure"
      );
    }
  };
  console.log(CloudFiles?.outlookevents, "oneDriveFiles");
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Outlook Calendar</h1>
        <MsalProvider instance={msalInstance}>
          <AzureConnector
            ButtonText={
              localStorage.getItem("onecalendartoken")
                ? "Disconnect Outlook Calendar"
                : "Connect Outlook Calendar"
            }
            scope={CalendarRequest}
            type="calendar"
            SetData={SetData}
            // CloudConnection={CloudConnection}
          />
        </MsalProvider>
      </div>
      <div className="mt-4">
        <CommonCalendar event={CloudFiles?.outlookevents} />
      </div>
    </>
  );
}
