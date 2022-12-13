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
export async function CalendarConnect(data) {
  const AuthTOken = localStorage.getItem("authtoken")
    ? localStorage.getItem("authtoken")
    : localStorage.getItem("apptoken");
  return await BaseService.post("/cloudstorage/calendar-connect", data, {
    headers: {
      token: AuthTOken,
    },
  });
}
export async function GetOneDriveFiles(token) {
  return await axios.get(
    "https://graph.microsoft.com/v1.0/me/drive/root/children",
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
export async function GetOutlookMail(token, params) {
  return await axios.get(
    params !== ""
      ? `https://graph.microsoft.com/v1.0/me/messages?$search=${params}`
      : `https://graph.microsoft.com/v1.0/me/messages`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
export async function GetOneDriveCalendarEvents(token) {
  return await axios.get(
    "https://graph.microsoft.com/v1.0/me/calendar/events",
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
export async function GetTeamsMeeting(token) {
  return await axios.get(
    "https://graph.microsoft.com/v1.0/communications/OnlineMeetings",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export async function DropBoxFiles(params) {
  return await axios.post(
    "https://api.dropboxapi.com/2/files/list_folder",
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
