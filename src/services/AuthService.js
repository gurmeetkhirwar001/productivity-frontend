import ApiService from "./ApiService";
import BaseService from "./BaseService";

export async function apiTokenGeneration() {
  return await BaseService.post("/auth", {
    tenant_Code: 177,
    user_Code: 177,
    request_key: "App Auth Key",
    auth_Class: "pvtauthapi",
    isPriv: "1",
    time_Out: "540",
    time_Out_Class: "minutes",
    User_Status: 1,
    sys_Default: "0",
    added_Ts: 1668675893149,
    updt_TS: 1668675893149,
    added_User: 177,
    updt_User: 177,
  });
}

export async function apiSignIn(data) {
  return await BaseService.post("/users/signin-user", data);
}
export async function apiSocial(data) {
  return await BaseService.post("/users/social-signup", data);
}

export async function apiSignUp(data) {
  return await BaseService.post("/users/signup-user", data);
}
export async function apiValidateUser(data) {
  return await BaseService.post("/users/validate-user", data);
}
export async function apiSignOut(data) {
  return ApiService.fetchData({
    url: "/sign-out",
    method: "post",
    data,
  });
}

export async function apiForgotPassword(data) {
  return ApiService.fetchData({
    url: "/forgot-password",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data) {
  return ApiService.fetchData({
    url: "/reset-password",
    method: "post",
    data,
  });
}
