/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button } from "components/ui";
import { useParams } from "react-router-dom";
import useCloud from "utils/hooks/useCloud";
import DropBoxTable from "./dropboxfiles";
export default function DropboxFetch() {
  const {
    DropboxAuthToken,
    CloudConnection,
    DropBoxFetchFiles,
    DropBoxUserDetails,
    DropBoxUploadFile,
  } = useCloud();
  //   const [files, setFiles] = useState([]);
  const [dropboxfiles, setDropBoxfiles] = useState([]);
  let filesArray = [];
  const [open, setOpen] = useState(false);
  useEffect(() => {
    async function getAccessToken() {
      if (
        window.location.href.includes("code") &&
        !localStorage.getItem("dropboxtoken")
      ) {
        let code = window.location.href.split("?")[1].split("=")[1];
        localStorage.setItem("dropboxcode", code);
        const body = {
          code,
          grant_type: "authorization_code",
          redirect_uri: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
          //   response_type: "token",
        };
        let files;
        await DropboxAuthToken(body);
        const userDetail = await DropBoxUserDetails();
        files = await DropBoxFetchFiles(setDropBoxfiles);
        console.log(files.entries, "userDetail");

        setDropBoxfiles(files?.entries);
        // }
        filesArray = files.entries;
        console.log(userDetail, "userDetail");
        await CloudConnection(
          {
            email: userDetail.email,
            name: userDetail.name.display_name,
            files: files.entries,
          },
          "cloud",
          "dropbox"
        );
      } else {
        const files = await DropBoxFetchFiles();
        // if (dropboxfiles.length < 0) {
        // }
        // console.log(files?.entries);
        setDropBoxfiles(files?.entries);
        filesArray = files?.entries;
      }
    }
    getAccessToken();
  }, [localStorage.getItem("dropboxtoken")]);
  const AuthorizeDropBox = () => {
    const ClientID =
      process.env.REACT_APP_NODE_ENV === "dev"
        ? process.env.REACT_APP_DROPBOX_CLIENTID_DEV
        : process.env.REACT_APP_DROPBOX_CLIENTID_PROD;
    window.location.replace(
      `https://www.dropbox.com/oauth2/authorize?client_id=${ClientID}&redirect_uri=${window.location.protocol}//${window.location.host}${window.location.pathname}&response_type=code`
    );
  };
  console.log(filesArray, "filesArray");
  const disconnectDropBox = () => {
    localStorage.removeItem("dropboxtoken");
    setDropBoxfiles([]);
  };
  const UploadDropBoxFiles = async (file) => {
    await DropBoxUploadFile(file);
    const files = await DropBoxFetchFiles();
    setDropBoxfiles(files?.entries);
    setOpen(false);
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Dropbox</h1>
        <Button
          variant="solid"
          onClick={() =>
            localStorage.getItem("dropboxtoken")
              ? disconnectDropBox()
              : AuthorizeDropBox()
          }
        >
          {localStorage.getItem("dropboxtoken")
            ? "Disconnect DropBox"
            : "Connect Dropbox"}
        </Button>
      </div>
      <div className="mt-4">
        <DropBoxTable
          data={dropboxfiles}
          className="lg:col-span-3"
          UploadDropBoxFiles={UploadDropBoxFiles}
          setOpen={setOpen}
          open={open}
        />
        {/* {files.map((file) => (
       <li>{file.name}</li>
     ))} */}
      </div>
    </>
  );
}
