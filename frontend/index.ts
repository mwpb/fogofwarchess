import m from "mithril";
import { io } from "socket.io-client";
import { BoardDiv } from "./components/BoardDiv";
import "./css/style.css";
import { getGame } from "./data/GameData";
import { GameControls } from "./components/GameControls";

let newSocket = async (socket_id: string) => {
  let data = await m.request({
    method: "POST",
    url: "/new_socket",
    body: { socket_id: socket_id },
    withCredentials: true,
  });
  console.log(data);
};

let App: m.Component = {
  view: () => m("div.app", [m(BoardDiv)]),
};

m.mount(document.body, App);

let startupRoutine = async () => {
  await getGame();
  let socket = io();
  socket.on("new_socket", (data: any) => {
    if ("socket_id" in data) newSocket(data.socket_id);
    getGame().catch(console.log);
  });
  socket.on("update", () => {
    getGame().catch(console.log);
  });
};
startupRoutine().catch(console.log);
