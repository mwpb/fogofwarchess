"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class LiveGames extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'live_games';
    }
    async up() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn("computerPlays");
            table.integer("computer_plays");
        });
    }
    async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn("computer_plays");
            table.integer("computerPlays");
        });
    }
}
exports.default = LiveGames;
//# sourceMappingURL=1609024826041_rename_computer_plays_agains.js.map