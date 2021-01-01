"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class LiveGames extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "live_games";
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string("white_username").primary();
            table.string("black_username").index().unique();
            table.string("fen");
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = LiveGames;
//# sourceMappingURL=1608852524083_live_games.js.map