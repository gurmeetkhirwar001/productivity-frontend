import io from "socket.io-client";
export var socket = io.connect(process.env.REACT_APP_SOCKET_URL, {
  reconnect: true,
});

socket.on("connect", () => {
  console.log(socket.connected);
});
socket.on("testing", function (d) {
  console.log(d, "dDay");
});
