import { Button } from "components/ui";
import React, { useEffect, useState } from "react";
import useColaboration from "utils/hooks/useCollaboration";

export default function Clickup() {
  const { GetCliCkupConnect, GetclickupToken } = useColaboration();
  const [authURL, setAuthURL] = useState({});
  const [connect, setConnected] = useState(false);
  useEffect(() => {
    async function GetSlackURL() {
      if (!localStorage.getItem("clickuptoken")) {
        const response = await GetCliCkupConnect({
          redirect_uri: window.location.href,
        });
        setAuthURL(response.data.message);
      }
      if (
        window.location.href.includes("code") &&
        !localStorage.getItem("clickuptoken")
      ) {
        let code = window.location.href.split("?")[1].split("=")[1];
        const response = await GetclickupToken({ code });
        console.log(response?.data?.message);
        localStorage.setItem(
          "clickuptoken",
          response?.data?.message?.access_token
        );
      }
      if (localStorage.getItem("clickuptoken")) {
        setConnected(true);
      }
    }
    GetSlackURL();
  }, [localStorage.getItem("clickuptoken")]);
  return (
    <div className="cloud-connect-container">
      <h1>ClickUp </h1>
      <Button variant="solid" onClick={() => window.location.replace(authURL)}>
        {!connect ? "Connect Clickup" : "Disconnect Clickup"}
      </Button>
    </div>
  );
}
