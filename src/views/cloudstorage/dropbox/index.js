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
  } = useCloud();
  //   const [files, setFiles] = useState([]);
  let filesArray;
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
          redirect_uri: `http://localhost:3000${window.location.pathname}`,
          //   response_type: "token",
        };
        await DropboxAuthToken(body);
        const userDetail = await DropBoxUserDetails();
        const files = await DropBoxFetchFiles();
        console.log(userDetail, "userDetail");
        console.log(files.file_requests, "userDetail");
        await CloudConnection(
          {
            email: userDetail.email,
            name: userDetail.name.display_name,
            files: files.file_requests,
          },
          "cloud",
          "dropbox"
        );
      } else {
        const files = await DropBoxFetchFiles();
        // setFiles(files.file_requests);
        filesArray = files?.file_requests;
      }
    }
    getAccessToken();
  }, [DropboxAuthToken]);
  const AuthorizeDropBox = () => {
    window.location.replace(
      `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.REACT_APP_DROPBOX_CLIENTID}&redirect_uri=http://localhost:3000${window.location.pathname}&response_type=code`
    );
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Dropbox</h1>
        <Button variant="solid" onClick={() => AuthorizeDropBox()}>
          {localStorage.getItem("dropboxtoken")
            ? "Disconnect DropBox"
            : "Connect Dropbox"}
        </Button>
      </div>
      <div className="mt-4">
        <DropBoxTable data={filesArray ||[]} className="lg:col-span-3" />
        {/* {files.map((file) => (
       <li>{file.name}</li>
     ))} */}
      </div>
    </>
  );
}
