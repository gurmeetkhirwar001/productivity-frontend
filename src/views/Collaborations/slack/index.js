import { Button } from "components/ui";
import React, { useEffect, useState } from "react";
import useColaboration from "utils/hooks/useCollaboration";

export default function Slack() {
  const { GetSlackConnect, GetSlackToken } = useColaboration();
  const [authURL, setAuthURL] = useState({});
  const [connect, setConnected] = useState(false);
  useEffect(() => {
    async function GetSlackURL() {
      if (!localStorage.getItem("slacktoken")) {
        const response = await GetSlackConnect();
        setAuthURL(response.data.message);
      }
      if (
        window.location.href.includes("code") &&
        !localStorage.getItem("slacktoken")
      ) {
        let code = window.location.href
          .split("?")[1]
          .split("=")[1]
          .split("&")[0];
        const response = await GetSlackToken({ code });
        console.log(response?.data?.message);
        localStorage.setItem("slacktoken", response?.data?.message);
      }
      if (localStorage.getItem("slacktoken")) {
        setConnected(true);
      }
    }
    GetSlackURL();
  }, []);
  return (
    <div className="cloud-connect-container">
      <h1>Slack </h1>
      <Button variant="solid" onClick={() => window.location.replace(authURL)}>
        {!connect ? "Connect Slack" : "Disconnect Slack"}
      </Button>
    </div>
  );
}
