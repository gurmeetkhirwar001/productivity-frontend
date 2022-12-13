/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { Button } from "components/ui";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalConfig } from "../views/auth/Azure/authconfig";
import { PublicClientApplication } from "@azure/msal-browser";
import axios from "axios";
import useAuth from "./hooks/useAuth";

export default function AzureConnector({
  ButtonText,
  scope,
  SetData,
  type,
  CloudConnection,
}) {
  const { instance } = useMsal();
  const { signIn } = useAuth();
  const [mstoken, setMsToken] = useState(
    localStorage.getItem("mstoken") || null
  );
  useEffect(() => {
    async function setMsTokenLocal() {
      console.log(mstoken, "Mstoken");
      localStorage.setItem("mstoken", mstoken);
    }
    setMsTokenLocal();
  }, [mstoken]);
  const token =
    type === "calendar"
      ? localStorage.getItem("onecalendartoken")
      : type === "mail"
      ? localStorage.getItem("outlookmailtoken")
      : type === "meetings"
      ? localStorage.getItem("msteamstoken")
      : localStorage.getItem("onedrivetoken");
  const HandleLogin = (loginType) => {
    console.log("hello");
    if (loginType === "popup") {
      instance
        .loginPopup(scope)
        .then(async (res) => {
          //   signIn(res?.idToken, "sso", "Azure");
          console.log(res);
          if (type === "calendar") {
            localStorage.setItem("onecalendartoken", res?.accessToken);
            localStorage.setItem("onecalendarrefreshtoken", res?.refresh_token);
          } else if (type === "mail") {
            localStorage.setItem("outlookmailtoken", res?.accessToken);
          } else if (type === "meetings") {
            console.log(res?.accessToken, "teams");
            setMsToken(res?.accessToken);
            localStorage.setItem("teamsrefrshtoken", res?.refresh_token);
          } else {
            localStorage.setItem("onedrivetoken", res?.accessToken);
            localStorage.setItem("onedriverefreshtoken", res?.refresh_token);
          }
          let access_token =
            type === "calendar" ? res?.access_token : res?.accessToken;
          SetData(res?.accessToken, res?.idToken);
          // CloudConnection(res?.idToken)
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const HandleLogout = () => {
    if (type == "calendar") {
      localStorage.removeItem("onecalendartoken");
    } else if (type === "mail") {
      localStorage.removeItem("outlookmailtoken");
    } else if (type === "meetings") {
      localStorage.removeItem("msteamstoken");
    } else {
      localStorage.removeItem("onedrivetoken");
    }
  };
  return (
    <div className="cloud-connect-container">
      <Button
        variant="solid"
        onClick={() => (token ? HandleLogout() : HandleLogin("popup"))}
      >
        {ButtonText}
      </Button>
      {localStorage.removeItem("msteamstoken") && type === "meetings" && (
        <Button
          variant="solid"
          // onClick={() => (token ? HandleLogout() : HandleLogin("popup"))}
        >
          Create Meeting
        </Button>
      )}
    </div>
  );
}
