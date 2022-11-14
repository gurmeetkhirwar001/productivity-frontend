import ApiService from "./ApiService";
import BaseService from "./BaseService";

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
