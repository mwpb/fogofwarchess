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
            table.string("status");
        });
    }
    async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn("status");
        });
    }
}
exports.default = LiveGames;
//# sourceMappingURL=1609353066502_add_outcome_infos.js.map