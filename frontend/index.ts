import m from "mithril";
import { io } from "socket.io-client";

let startGame = async () => {
  let data = await m.request({
    method: "POST",
    url: "/live_games",
    body: { command: "start_game" },
    withCredentials: true,
  });
  console.log(data);
};

let getGame = async () => {
  let data = await m.request({
    method: "POST",
    url: "/live_games",
    body: { command: "get_game" },
    withCredentials: true,
  });
  console.log(data);
};

let sendMove = async () => {
  let data = await m.request({
    method: "POST",
    url: "/live_games",
    body: { command: "move", move: "e2e4" },
    withCredentials: true,
  });
  console.log(data);
};

let deleteGame = async () => {
  let data = await m.request({
    method: "POST",
    url: "/live_games",
    body: { command: "resign" },
    withCredentials: true,
  });
  console.log(data);
};

let newSocket = async (socket_id: string) => {
  let data = await m.request({
    method: "POST",
    url: "/new_socket",
    body: { socket_id: socket_id },
    withCredentials: true,
  });
  console.log(data);
};

let GameControls: m.Component = {
  view: () =>
    m("div", [
      m("h1", "Game controls"),
      m("button", { onclick: startGame }, "Start game"),
      m("button", { onclick: getGame }, "Get game"),
      m("button", { onclick: sendMove }, "Send move"),
      m("button", { onclick: deleteGame }, "Resign game"),
    ]),
};

m.render(document.body, m(GameControls));

let socket = io();
socket.on("new_socket", (data: any) => {
  if ("socket_id" in data) newSocket(data.socket_id);
});
socket.on("update", (data: any) => {
  console.log("update");
});
