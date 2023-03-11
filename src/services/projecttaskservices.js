import axios from "axios";
import ApiService from "./ApiService";
import BaseService from "./BaseService";
var charsToEncode = /[\u007f-\uffff]/g;
function http_header_safe_json(v) {
  return JSON.stringify(v).replace(charsToEncode, function (c) {
    return "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4);
  });
}
export async function CreateNewProject(data) {
  const AuthTOken = localStorage.getItem("authtoken")
    ? localStorage.getItem("authtoken")
    : localStorage.getItem("apptoken");
  return await BaseService.post("/tasks/createProject", data, {
    headers: {
      token: AuthTOken,
    },
  });
}
export async function UpdateProject(data) {
  const AuthTOken = localStorage.getItem("authtoken")
    ? localStorage.getItem("authtoken")
    : localStorage.getItem("apptoken");
  return await BaseService.patch("/tasks/updateProject", data, {
    headers: {
      token: AuthTOken,
    },
  });
}
export async function CloneProject(data) {
  const AuthTOken = localStorage.getItem("authtoken")
    ? localStorage.getItem("authtoken")
    : localStorage.getItem("apptoken");
  return await BaseService.patch("/tasks/cloneProject", data, {
    headers: {
      token: AuthTOken,
    },
  });
}
export async function GetprojectTypeList(data) {
    const AuthTOken = localStorage.getItem("authtoken")
      ? localStorage.getItem("authtoken")
      : localStorage.getItem("apptoken");
    return await BaseService.post("/tasks/getProjectType", data, {
      headers: {
        token: AuthTOken,
      },
    });
  }