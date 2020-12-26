import Ws from "App/Services/Ws";

Ws.start((socket) => {
  socket.emit("new_socket", { socket_id: socket.id });

  socket.on("my other event", (data) => {
    console.log(data);
  });
});
