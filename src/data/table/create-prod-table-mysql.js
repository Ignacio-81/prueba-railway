import config from "../../db/config/config_mysql.js";
import knex from "knex";
const database = knex(config);

const createProdTable = async (table) => {
    try {
        await database.schema.dropTableIfExists(table);

        await database.schema.createTable(table, (newTable) => {
            newTable.increments("id").primary();
            newTable.string("title", 25).notNullable();
            newTable.integer("price").notNullable();
            newTable.string("thumbnail", 500).notNullable();
        });

        console.log(table + " table created in SQL DB!");
        //database.destroy();

    } catch (err) {
        database.destroy();
        throw new Error(`Error while creating DataBase: ${err}`)
    }
};

export default createProdTable;
