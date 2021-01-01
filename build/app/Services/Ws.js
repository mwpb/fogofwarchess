"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const Server_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Server"));
class Ws {
    constructor() {
        this.isReady = false;
    }
    start(callback) {
        this.io = new socket_io_1.default.Server(Server_1.default.instance);
        this.io.on("connection", callback);
        this.isReady = true;
    }
    getSockets() {
        console.log(this.io.allSockets());
        console.log(this.io.sockets);
    }
}
exports.default = new Ws();
//# sourceMappingURL=Ws.js.map