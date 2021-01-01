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
        this.schema.table(this.tableName, (table) => {
            table.bigInteger("white_time_left").unsigned().notNullable();
            table.bigInteger("black_time_left").unsigned().notNullable();
            table.bigInteger("time_of_last_move").unsigned().notNullable();
        });
    }
    async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn("white_time_left");
            table.dropColumn("black_time_left");
            table.dropColumn("time_of_last_move");
        });
    }
}
exports.default = LiveGames;
//# sourceMappingURL=1609346598732_add_clock_informations.js.map