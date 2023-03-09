//Configuration for Sqlite Database version
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
    client: 'sqlite3',
    connection: { filename: path.resolve(__dirname, "../../ecommerce/chatdb.sqlite") },
    useNullAsDefault: true
};



export default config;
