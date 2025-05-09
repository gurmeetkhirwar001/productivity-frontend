import React, { useState, useEffect } from "react";
import { Button } from "components/ui";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { DriveRequest } from "views/auth/Azure/authconfig";
import AzureConnector from "utils/AzureWrapper";
import { msalConfig } from "../../auth/Azure/authconfig";
import useCloud from "../../../utils/hooks/useCloud";
import { PublicClientApplication } from "@azure/msal-browser";
import { CloudConnect, GetOneDriveFiles } from "services/CloudStorageService";
import OneDriveFiles from "./onedrivefiles";
import { useSelector } from "react-redux";
export default function OneDriveFetch() {
  const msalInstance = new PublicClientApplication(msalConfig);
  const Authenticated = useIsAuthenticated();
  const CloudFiles = useSelector((state) => state.cloud.CloudSlice);
  const { HandleOneDrivefiles, CloudConnection } = useCloud();
  useEffect(() => {
    let driveToken = localStorage.getItem("onedrivetoken");
    SetData(driveToken);
  }, []);
  const SetData = async (token, idToken) => {
    const response = await GetOneDriveFiles(token);
    console.log(response.data);
    HandleOneDrivefiles(response.data.value);
    console.log(idToken);
    if (idToken) {
      CloudConnection(
        { token: idToken, files: response.data.value },
        "cloud",
        "Azure"
      );
    }
    //  await CloudConnect({
    //   token
    //   },"cloud", "onedrive")
  };
  console.log(CloudFiles?.onedriveFiles, "oneDriveFiles");
  return (
    <>
      <div className="cloud-connect-container">
        <h1>OneDrive</h1>
        <MsalProvider instance={msalInstance}>
          <AzureConnector
            ButtonText={
              localStorage.getItem("onedrivetoken")
                ? "Disconnect Drive"
                : "Connect One Drive"
            }
            scope={DriveRequest}
            SetData={SetData}
            type="drive"
            CloudConnection={CloudConnection}
          />
        </MsalProvider>
      </div>
      <div className="mt-4">
        <OneDriveFiles data={CloudFiles?.onedriveFiles || []} />
      </div>
    </>
  );
}
