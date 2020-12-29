import { Piece, Square } from "fowc-lib/dist";
import m from "mithril";
import { io } from "socket.io-client";
import { BoardDiv } from "./components/BoardDiv";
import "./css/style.css";
import {
  deleteGame,
  getGame,
  sendMove,
  startComputerGame,
  startHumanGame,
} from "./data/GameData";

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
      m("button", { onclick: startComputerGame }, "Play computer"),
      m("button", { onclick: startHumanGame }, "Play human"),
      m("button", { onclick: getGame }, "Get game"),
      m(
        "button",
        {
          onclick: () => {
            sendMove({
              fromSquare: Square.E2,
              toSquare: Square.E4,
              promotionPiece: Piece.Empty,
            });
          },
        },
        "Send move"
      ),
      m("button", { onclick: deleteGame }, "Resign game"),
    ]),
};

let App: m.Component = {
  view: () => m("div.app", [m(GameControls), m(BoardDiv)]),
};

m.mount(document.body, App);

let socket = io();
socket.on("new_socket", (data: any) => {
  if ("socket_id" in data) newSocket(data.socket_id);
});
socket.on("update", (data: any) => {
  getGame();
});
