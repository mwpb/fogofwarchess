"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class GameRequests extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "game_requests";
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string("username").primary();
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = GameRequests;
//# sourceMappingURL=1609264321099_game_requests.js.map