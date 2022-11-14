import {
  CloudConnect,
  DropBoxAuthToken,
  DropBoxFiles,
  DropBoxGetUserAccount,
} from "services/CloudStorageService";

import jwtDecode from "jwt-decode";
import { encryptMessage } from "utils/common";
import axios from "axios";
function useCloud() {
  const CloudConnection = async (data, type, source) => {
    try {
      if (source === "googledrive") {
        const {
          email,
          picture: avatar,
          name: userName,
          preferred_username,
          ...restUser
        } = jwtDecode(data.token);
        const encruptedbody = encryptMessage({
          email: source == "Azure" ? preferred_username : email,
          avatar: source == "Azure" ? "" : avatar,
          userName,
          type,
          source,
          files: data.files,
        });
        const resp = await CloudConnect({ body: encruptedbody });
        if (resp.data.is_success === true) {
          return {
            status: "success",
            message: "",
          };
        }
      } else {
        const encruptedbody = encryptMessage(data);
        const resp = await CloudConnect({ body: encruptedbody });
        if (resp.data.is_success === true) {
          return {
            status: "success",
            message: "",
          };
        }
      }
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };
  const DropboxAuthToken = async (data) => {
    const params = new URLSearchParams();
    params.append("code", data.code);
    params.append("grant_type", data.grant_type);
    params.append("client_id", process.env.REACT_APP_DROPBOX_CLIENTID);
    params.append("client_secret", process.env.REACT_APP_DROPBOX_SECRETE);
    params.append("redirect_uri", data.redirect_uri);
    const res = await DropBoxAuthToken(params);
    localStorage.setItem("dropboxtoken", res.data.access_token);
  };
  const DropBoxFetchFiles = async () => {
    const params = new URLSearchParams();
    // params.append("limit", 20);
    const res = await DropBoxFiles({ limit: 20 });
    return res.data;
  };
  const DropBoxUserDetails = async () => {
    const params = new URLSearchParams();
    params.append("limit", 20);
    const res = await DropBoxGetUserAccount();
    return res.data;
  };
  return {
    CloudConnection,
    DropboxAuthToken,
    DropBoxFetchFiles,
    DropBoxUserDetails,
  };
}

export default useCloud;
