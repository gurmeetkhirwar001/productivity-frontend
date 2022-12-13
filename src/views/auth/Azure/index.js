/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalConfig, loginRequest } from "./authconfig";
import useAuth from "utils/hooks/useAuth";

export default function AzureLogin() {
  const { instance } = useMsal();
  const { signIn } = useAuth();
  const HandleLogin = (loginType) => {
    console.log("hello");
    if (loginType === "popup") {
      instance
        .loginPopup(loginRequest)
        .then((res) => {
          signIn(res?.idToken, "sso", "Azure");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    // <MsalProvider instance={msalInstance}>
    <img src="/img/social/azure.png" onClick={() => HandleLogin("popup")} />
    // </MsalProvider>
  );
}
