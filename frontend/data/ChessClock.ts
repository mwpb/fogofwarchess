let whiteTimer: NodeJS.Timeout;
let blackTimer: NodeJS.Timeout;
import m from "mithril";
import { getGame } from "./GameData";

export let white_time_left: number = 0;
export let black_time_left: number = 0;

export let setWhiteTimeLeft = (t: number) => {
  white_time_left = t;
};
export let setBlackTimeLeft = (t: number) => {
  black_time_left = t;
};

export let startWhiteTimer = () => {
  let startTime = Date.now();
  let originalTimeLeft = white_time_left;
  whiteTimer = setInterval(() => {
    let currentTime = Date.now();
    white_time_left = originalTimeLeft - (currentTime - startTime);
    console.log(`white_time_left ${white_time_left}`);
    
    if (white_time_left < 0) {
      stopWhiteTimer();
      getGame();
    } else {
      m.redraw();
    }
  }, 1000);
};

export let startBlackTimer = () => {
  let startTime = Date.now();
  let originalTimeLeft = black_time_left;
  blackTimer = setInterval(() => {
    let currentTime = Date.now();
    black_time_left = originalTimeLeft - (currentTime - startTime);
    console.log(`black_time_left ${black_time_left}`);
    if (black_time_left < 0) {
      stopBlackTimer();
      getGame();
    } else {
      m.redraw();
    }
  }, 1000);
};

export let stopWhiteTimer = () => {
  clearInterval(whiteTimer);
};

export let stopBlackTimer = () => {
  clearInterval(blackTimer);
};
