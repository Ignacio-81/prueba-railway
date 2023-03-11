import insertProds from "../../data/create-prods.js"
import createProdTable from "../../data/table/create-prod-table-mysql.js"
import createChatTable from "../../data/table/create-chat-table-sqlite.js"
import { mongoConnect } from '../../db/config/mongoConfig.js';
//import { config } from "dotenv";

//config();

//export const configObject = {
//    mongoUrl: process.env.MONGO_URL,
//};

export async function dbInit() {
    try {
        //Create new chat table on SQlite DB
        await createChatTable("chats")
        //Create the new table on the database
        await createProdTable("products")

        //Insert Base products into the database
        await insertProds()
        await mongoConnect();
    } catch (err) {
        //console.error(err)
        throw new Error(`Error while connecting to DB ${err}`)
    }
}


//export const dbConfig = { configObject, dbInit }
