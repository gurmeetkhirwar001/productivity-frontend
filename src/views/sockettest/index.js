import { Button } from "components/ui";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

export default function SocketTest() {
  const socket = React.useMemo(() => io("http://localhost:4000/socket"), []);
  useEffect(() => {
    socket.on("receive-hi", function (dasds) {
      console.log(dasds, "Connected");
    });
    socket.on("in", function (something) {
      console.log(something, "something");
    });
  }, []);
  const HandleSendMessage = () => {
    socket.emit("hi", "Hi SJNM");
  };
  return (
    <>
      <h1>Socket Data</h1>
      <Button onClick={() => HandleSendMessage()}>Send Message</Button>
    </>
  );
}
