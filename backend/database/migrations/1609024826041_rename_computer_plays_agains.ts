import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class LiveGames extends BaseSchema {
  protected tableName = 'live_games'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("computerPlays");
      table.integer("computer_plays");
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("computer_plays");
      table.integer("computerPlays");
    })
  }
}
