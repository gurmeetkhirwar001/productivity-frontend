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
  return await BaseService.post("/users/signin-user", data, {
    headers: {
      token: localStorage?.getItem("apptoken"),
    },
  });
}
export async function apiuserprofileupdate(data) {
  return await BaseService.patch("/users/update-profile", data, {
    headers: {
      token: localStorage?.getItem("authtoken"),
    },
  });
}
export async function apiuserpasswordupdate(data) {
  return await BaseService.patch("/users/update-password", data, {
    headers: {
      token: localStorage?.getItem("authtoken"),
    },
  });
}
export async function googleauth(data) {
  return await BaseService.post("/googleauth/auth", data, {
    headers: {
      token: localStorage?.getItem("apptoken"),
    },
  });
}
export async function fbauth(data) {
  return await BaseService.post("/facebook/auth", data, {
    headers: {
      token: localStorage?.getItem("apptoken"),
    },
  });
}
export async function azureauth(data) {
  return await BaseService.post("/azure/auth", data, {
    headers: {
      token: localStorage?.getItem("apptoken"),
    },
  });
}
export async function apiSocial(data) {
  return await BaseService.post("/users/social-signup", data, {
    headers: {
      token: localStorage?.getItem("apptoken"),
    },
  });
}

export async function apiSignUp(data) {
  return await BaseService.post("/users/signup-user", data, {
    headers: {
      token: localStorage?.getItem("apptoken"),
    },
  });
}
export async function apiValidateUser(data) {
  return await BaseService.post("/users/validate-user", data, {
    headers: {
      token: localStorage?.getItem("apptoken"),
    },
  });
}
export async function apigetprofile(data) {
  return await BaseService.post("/users/getProfile", data, {
    headers: {
      token: localStorage?.getItem("authtoken"),
    },
  });
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
