"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.on('/').render('welcome');
Route_1.default.post('/live_games', 'LiveGamesController.doPost');
Route_1.default.post('/new_socket', 'NewSocketsController.doPost');
//# sourceMappingURL=routes.js.map