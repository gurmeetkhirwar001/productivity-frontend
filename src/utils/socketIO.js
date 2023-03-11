import io from "socket.io-client";
export var socket = io.connect("http://localhost:9000/socket", {
  reconnect: true,
});

socket.on('connect', () => { console.log(socket.connected);  });
socket.on("testing", function(d) {
  console.log(d,"dDay");
});
