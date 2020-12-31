import { Color, GameStatus } from "fowc-lib/dist";
import m from "mithril";
import {
  black_username,
  colorToMove,
  game_status,
  position,
  user_color,
  white_username,
} from "../data/GameData";
import { BoardInput } from "./BoardInput";
import { GameControls } from "./GameControls";
import { clock } from "./Clock";
import { white_time_left, black_time_left } from "../data/ChessClock";

export let BoardDiv: m.Component = {
  view: () =>
    m("div.column", [
      m("div.row.alignCenter.spaceEvenly.lightBackground.shadow.high", [
        user_color === Color.Black
          ? clock(white_time_left)
          : clock(black_time_left),
      ]),
      m("div.row.alignCenter.justifyCenter.darkBackground.middle", [
        m(BoardInput),
      ]),
      m("div.row.alignCenter.spaceEvenly.lightBackground.shadow.high", [
        user_color === Color.White
          ? clock(white_time_left)
          : clock(black_time_left),
      ]),
      m(GameControls),
    ]),
};
