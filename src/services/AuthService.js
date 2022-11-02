import axios from "axios";
import ApiService from "./ApiService";
import { AxiosBaseUrl } from "./config";

export async function apiSignIn(data) {
  try {
    const response = await AxiosBaseUrl.post("users/signin-user", data, {
      headers: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiQXBwLXRva2VuIiwiaWF0IjoxNjY1MjE2MzE1fQ.Gw-4o7gRwxkY_l7crZgy3tmYW2fGY74eBslVfNUdMis",
      },
    });
    return response;
  } catch (e) {
    return e.response;
  }
}

export async function apiSignUp(data) {
  return ApiService.fetchData({
    url: "/sign-up",
    method: "post",
    data,
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
