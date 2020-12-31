import { Color, GameStatus, Position } from "fowc-lib/dist";
import m from "mithril";
import { gameStatusDisplay } from "./GameStatusDisplay";

import {
  colorToMove,
  deleteGame,
  game_status,
  is_requesting_human_game,
  startComputerGame,
  startHumanGame,
  stopGameRequest,
} from "../data/GameData";

let playComputerButton = (game_status: GameStatus): m.Vnode => {
  return game_status !== GameStatus.InProgress
    ? m("button", { onclick: startComputerGame }, "Play computer")
    : m("button", { onclick: deleteGame }, "Resign game");
};

let playHumanButton = (
  is_requesting_human_game: boolean,
  game_status: GameStatus
): m.Vnode => {
  if (game_status === GameStatus.InProgress) return m("");
  return is_requesting_human_game
    ? m("button", { onclick: stopGameRequest }, "Stop request")
    : m("button", { onclick: startHumanGame }, "Play human");
};

export let GameControls: m.Component = {
  view: () =>
    m("div.grid1x3.justifyCenter.spaceEvenly.lightBackground.pad.highest", [
      gameStatusDisplay(game_status, is_requesting_human_game, colorToMove),
      playComputerButton(game_status),
      playHumanButton(is_requesting_human_game, game_status),
    ]),
};
