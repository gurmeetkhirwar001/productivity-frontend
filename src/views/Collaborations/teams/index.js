import React, { useState, useEffect } from "react";
import { Button } from "components/ui";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { MeetingsRequest } from "views/auth/Azure/authconfig";
import AzureConnector from "utils/AzureWrapper";
import { msalConfig } from "../../auth/Azure/authconfig";
import useCloud from "../../../utils/hooks/useCloud";
import { PublicClientApplication } from "@azure/msal-browser";
import { GetTeamsMeeting } from "services/CloudStorageService";
// import OneDriveFiles from "./onedrivefiles";
import { useSelector } from "react-redux";
export default function Teams() {
  const msalInstance = new PublicClientApplication(msalConfig);
  const Authenticated = useIsAuthenticated();
  const CloudFiles = useSelector((state) => state.cloud.CloudSlice);
  const { HandleteamsMeeting, CalendarConnection } = useCloud();
  useEffect(() => {
    let driveToken = localStorage.getItem("mstoken");
    SetData(driveToken);
  }, []);
  const SetData = async (token, idToken) => {
    const response = await GetTeamsMeeting(token);
    // console.log(response.data);
    HandleteamsMeeting(response.data.value);
    // console.log(token, idToken);
    // if (idToken) {
    //   CalendarConnection(
    //     { token: idToken, files: response.data.value },
    //     "cloud",
    //     "Azure"
    //   );
    // }
  };
  console.log(CloudFiles?.outlookevents, "oneDriveFiles");
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Microsoft Teams</h1>
        <MsalProvider instance={msalInstance}>
          <AzureConnector
            ButtonText={
              localStorage.getItem("mstoken")
                ? "Disconnect Microsoft teams"
                : "Connect Microsoft teams"
            }
            scope={MeetingsRequest}
            type="meetings"
            SetData={SetData}
            // CloudConnection={CloudConnection}
          />
        </MsalProvider>
      </div>
    </>
  );
}
