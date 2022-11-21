import axios from "axios";
import ApiService from "./ApiService";
import BaseService from "./BaseService";

export async function CloudConnect(data) {
  const AuthTOken = localStorage.getItem("authtoken")
    ? localStorage.getItem("authtoken")
    : localStorage.getItem("apptoken");
  return await BaseService.post("/cloudstorage/cloud-connect", data, {
    headers: {
      token: AuthTOken,
    },
  });
}

export async function DropBoxFiles(params) {
  return await axios.post(
    "https://api.dropboxapi.com/2/file_requests/list_v2",
    params,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("dropboxtoken")}`,
      },
    }
  );
}
export async function DropBoxAuthToken(params) {
  return await axios.post("https://api.dropboxapi.com/oauth2/token", params);
}
export async function DropBoxGetUserAccount(params) {
  return await axios.post(
    "https://api.dropboxapi.com/2/users/get_current_account",
    null,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("dropboxtoken")}`,
      },
    }
  );
}
