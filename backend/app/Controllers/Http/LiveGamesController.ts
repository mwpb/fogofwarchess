import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { log } from "App/Utils/logUtils";
import { schema } from "@ioc:Adonis/Core/Validator";
import {
  Color,
  toFen,
  parseFen,
  getMoveFromAlg,
  getHalfPosition,
  GameStatus,
} from "fowc-lib/dist";
import Ws from "App/Services/Ws";
import { stockfishPlayMove } from "App/Utils/stockfish";
import {
  chooseColors,
  getExistingGame,
  makeMove,
  startLiveGame,
} from "App/Utils/liveGameUtils";
import GameRequest from "App/Models/GameRequest";

export default class LiveGamesController {
  public async doPost(ctx: HttpContextContract) {
    log("Hit LiveGames", ctx);
    const validated = await ctx.request.validate({
      schema: schema.create({
        command: schema.string({ trim: true }),
      }),
    });
    let command = validated.command;
    log(`Command: ${command}`, ctx);

    // In future use username
    let sessionId = ctx.session.sessionId;

    if (command === "start_computer_game") {
      await this.startComputerGame(sessionId, ctx);
    } else if (command === "start_human_game") {
      await this.startGame(sessionId, ctx);
    } else if (command === "get_game") {
      await this.getGame(sessionId, ctx);
    } else if (command === "move") {
      await this.move(sessionId, ctx);
    } else if (command === "resign") {
      await this.resign(sessionId, ctx);
    } else if (command === "stop_request") {
      this.stopRequest(sessionId, ctx);
    } else {
      log("Command not found.", ctx);
      ctx.response.status(404).send({});
    }
  }

  async startComputerGame(sessionId: string, ctx: HttpContextContract) {
    let [white_username, black_username] = chooseColors(
      sessionId,
      `stockfish${new Date().getTime()}`
    );
    let computerColor =
      black_username === sessionId ? Color.White : Color.Black;

    try {
      await startLiveGame(white_username, black_username, computerColor);

      log(`START GAME: ${white_username} vs ${black_username}`, ctx);
      ctx.response.status(200).send({});
      return;
    } catch (err) {
      log("Already playing game.", ctx);
      ctx.response.status(403).send({});
      return;
    }
  }

  async startGame(sessionId: string, ctx: HttpContextContract) {
    let gameRequests = await GameRequest.all();
    for (let gameRequest of gameRequests) {
      if (gameRequest.username !== sessionId) {
        let [white_username, black_username] = chooseColors(
          sessionId,
          gameRequest.username
        );
        await startLiveGame(white_username, black_username);
        log(`START GAME: ${white_username} vs ${black_username}`, ctx);
        ctx.response.status(200).send({});
        return;
      }
    }

    // Cannot find game so put in database
    try {
      let gameRequest = new GameRequest();
      gameRequest.username = sessionId;
      await gameRequest.save();

      log(`GAME REQUEST: ${sessionId}`, ctx);
      ctx.response.status(200).send({});
      return;
    } catch (err) {
      log(`Already have game request for: ${sessionId}`, ctx);
      ctx.response.status(200).send({});
      return;
    }
  }

  async getGame(sessionId: string, ctx: HttpContextContract) {
    let [existingGame, color] = await getExistingGame(sessionId);
    if (existingGame) {
      let position = parseFen(existingGame.fen);
      let halfPosition = getHalfPosition(position, color);
      log(`GET GAME: ${sessionId}`, ctx);
      let white_username =
        existingGame.computer_plays === Color.White
          ? existingGame.white_username
          : "you";
      let black_username =
        existingGame.computer_plays === Color.Black
          ? existingGame.black_username
          : "you";

      let time_of_last_move = existingGame.time_of_last_move;
      let white_time_left = existingGame.white_time_left;
      let black_time_left = existingGame.black_time_left;
      if (position.colorToMove === Color.White) {
        white_time_left = white_time_left - (Date.now() - time_of_last_move);
        time_of_last_move = Date.now();
      }
      if (position.colorToMove === Color.Black) {
        black_time_left = black_time_left - (Date.now() - time_of_last_move);
        time_of_last_move = Date.now();
      }

      let status = existingGame.status;
      if (white_time_left <= 0) {
        white_time_left = 0;
        status = GameStatus.BlackWins;
      }
      if (black_time_left <= 0) {
        black_time_left = 0;
        status = GameStatus.WhiteWins;
      }

      existingGame.time_of_last_move = time_of_last_move;
      existingGame.white_time_left = white_time_left;
      existingGame.black_time_left = black_time_left;
      existingGame.status = status;

      await existingGame.save();

      ctx.response.status(200).send({
        white_username: white_username,
        black_username: black_username,
        white_time_left: white_time_left,
        black_time_left: black_time_left,
        time_of_last_move: time_of_last_move,
        status: status,
        myColor: color,
        fen: toFen(halfPosition),
      });
      return;
    }

    log(`${sessionId} is not playing a game`, ctx);
    ctx.response.status(404).send({});
    return;
  }

  async move(sessionId: string, ctx: HttpContextContract) {
    const validated = await ctx.request.validate({
      schema: schema.create({
        move: schema.string({ trim: true }),
      }),
    });
    let moveString = validated.move;

    let [existingGame, color] = await getExistingGame(sessionId);
    if (!existingGame) {
      log(`${sessionId} is not playing a game`, ctx);
      ctx.response.status(404).send({});
      return;
    }

    let position = parseFen(existingGame.fen);
    if (position.colorToMove !== color) {
      log(`It is not your turn ${sessionId}`, ctx);
      ctx.response.status(403).send({});
      return;
    }

    let moveObj = getMoveFromAlg(moveString);
    let moveResult = await makeMove(moveObj, existingGame, position, color);

    let computerColor = existingGame.computer_plays;

    if (moveResult.newPosition.colorToMove === computerColor) {
      stockfishPlayMove(existingGame.white_username);
    }

    Ws.io.to(existingGame.white_username).emit("update");
    Ws.io.to(existingGame.black_username).emit("update");

    log(`Played move ${moveString}`, ctx);
    ctx.response.status(200).send({});
    return;
  }

  async resign(sessionId: string, ctx: HttpContextContract) {
    let [existingGame, color] = await getExistingGame(sessionId);
    if (existingGame && color === Color.White) {
      existingGame.status = GameStatus.WhiteResigns;
      await existingGame.save();
    }
    if (existingGame && color === Color.Black) {
      existingGame.status = GameStatus.BlackResigns;
      await existingGame.save();
    }

    if (existingGame) {
      Ws.io.to(existingGame.white_username).emit("update");
      Ws.io.to(existingGame.black_username).emit("update");
    }

    log(`${sessionId} resigns game`, ctx);
    ctx.response.status(200).send({});
    return;
  }

  async stopRequest(sessionId: string, ctx: HttpContextContract) {
    let existingRequest = await GameRequest.findBy("username", sessionId);
    if (existingRequest) {
      await existingRequest.delete();
      log(`Deleted gameRequest for ${sessionId}`, ctx);
    } else {
      log(`No gameRequests to delete for ${sessionId}`, ctx);
    }
    ctx.response.status(200).send({});
    return;
  }
}
