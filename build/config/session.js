"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const sessionConfig = {
    driver: Env_1.default.get('SESSION_DRIVER'),
    cookieName: 'adonis-session',
    clearWithBrowser: false,
    age: '2h',
    cookie: {
        path: '/',
        httpOnly: true,
        secure: Env_1.default.get("NODE_ENV") !== "development",
        sameSite: "strict",
    },
    file: {
        location: '',
    },
    redisConnection: 'local',
};
exports.default = sessionConfig;
//# sourceMappingURL=session.js.map