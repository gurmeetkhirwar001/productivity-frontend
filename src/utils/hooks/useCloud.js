import {
  CloudConnect,
  DropBoxAuthToken,
  DropBoxFiles,
  DropBoxGetUserAccount,
  CalendarConnect,
  UploadDropBoxFiles,
} from "services/CloudStorageService";

import jwtDecode from "jwt-decode";
import { encryptMessage } from "utils/common";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setDropboxList,
  setOneDriveFiles,
  setoutlookEvents,
  setoutlookmails,
  setteamsmeetings,
} from "store/cloud/cloudSlice";
function useCloud() {
  const dispatch = useDispatch();
  const CloudConnection = async (data, type, source) => {
    try {
      if (source === "googledrive" || source === "Azure") {
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
  const CalendarConnection = async (data, type, source) => {
    try {
      if (source === "googlecalendar" || source === "outlookcalendar") {
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
        const resp = await CalendarConnect({ body: encruptedbody });
        if (resp.data.is_success === true) {
          return {
            status: "success",
            message: "",
          };
        }
      } else {
        const encruptedbody = encryptMessage(data);
        const resp = await CalendarConnect({ body: encruptedbody });
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
    let clientid =
      process.env.REACT_APP_NODE_ENV === "dev"
        ? process.env.REACT_APP_DROPBOX_CLIENTID_DEV
        : process.env.REACT_APP_DROPBOX_CLIENTID_PROD;
    let clientSecrete =
      process.env.REACT_APP_NODE_ENV === "dev"
        ? process.env.REACT_APP_DROPBOX_SECRETE_DEV
        : process.env.REACT_APP_DROPBOX_SECRETE_PROD;
    const params = new URLSearchParams();
    params.append("code", data.code);
    params.append("grant_type", data.grant_type);
    params.append("client_id", clientid);
    params.append("client_secret", clientSecrete);
    params.append("redirect_uri", data.redirect_uri);
    const res = await DropBoxAuthToken(params);
    localStorage.setItem("dropboxtoken", res.data.access_token);
  };
  const DropBoxFetchFiles = async () => {
    const res = await DropBoxFiles({ path: "" });
    console.log(res.data.entries, "filed data");
    dispatch(setDropboxList(res.data.entries));
    return res.data;
  };
  const DropBoxUserDetails = async () => {
    const params = new URLSearchParams();
    params.append("limit", 20);
    const res = await DropBoxGetUserAccount();
    return res.data;
  };
  const DropBoxUploadFile = async (params) => {
    const res = await UploadDropBoxFiles(params);
    return res.data;
  };
  const HandleOneDrivefiles = (files) => {
    dispatch(setOneDriveFiles(files));
  };
  const HandleCalendarEvent = (files) => {
    let events = files.map((ite) => {
      return {
        startDate: ite.start.dateTime,
        endDate: ite.end.dateTime,
        title: ite.subject,
        id: ite.id,
      };
    });
    dispatch(setoutlookEvents(events));
  };


  const HandleOutlookmail = (files) => {
    dispatch(setoutlookmails(files));
  };
  const HandleteamsMeeting = (files) => {
    dispatch(setteamsmeetings(files));
  };
  return {
    CloudConnection,
    DropboxAuthToken,
    DropBoxFetchFiles,
    DropBoxUserDetails,
    HandleOneDrivefiles,
    CalendarConnection,
    HandleCalendarEvent,
    HandleOutlookmail,
    HandleteamsMeeting,
    DropBoxUploadFile
  };
}

export default useCloud;
