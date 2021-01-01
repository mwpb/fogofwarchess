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
        this.schema.alterTable(this.tableName, (table) => {
            table.integer("computerPlays");
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn("computerPlays");
        });
    }
}
exports.default = LiveGames;
//# sourceMappingURL=1609023504963_live_games.js.map