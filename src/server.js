import MongoStore from "connect-mongo";
import express, { json, urlencoded } from "express";
import session from "express-session";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars"
import Container from "./db/DB-container.js";
import configMySql from './db/config/config_mysql.js'
import configSqlite from './db/config/config_sqlite.js'
import router from "./routes/index.js"
import passport from "passport";
import { passportStrategies } from "./lib/passport.lib.js";
import { User } from "./db/config/user.model.js"
import { dbInit } from "./db/config/index.js";
import invalidUrl from "./middleware/invalidUrl.middleware.js";
import yargs from "yargs";
import cluster from "cluster";
import os from "os";
import urlRegister from "./middleware/logger.mdw.js"
import { errorLogger } from "./lib/logger.lib.js"
import { config } from "dotenv";
config();

//Define confirguration for console paramteters:
export const args = yargs(process.argv.slice(2))
    .alias({
        p: "port",
        m: "mode",
    })
    .default({
        port: 8080,
        mode: "fork",
    }).argv;


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
//Define configuration for Products DB and Chata DB
let dbProducts = new Container("products", configMySql)
let dbChats = new Container("chats", configSqlite)

app.use(
    session({
        secret: "coderhouse",
        resave: false,
        rolling: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongoUrl: "mongodb+srv://IBadella:yR6NsdkTtzIObQcF@nachocluster.ytxqvsv.mongodb.net/?retryWrites=true&w=majority",
            mongoOptions,
        }),
        cookie: {
            expires: 60000 //session will expire without activity
        }
    })
);

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main.hbs",
    })
)
app.set("view engine", ".hbs");
app.use("/static", express.static(__dirname + "/public"));

app.use(passport.initialize());
app.use(passport.session());

passport.use("login", passportStrategies.loginStrategy);
passport.use("register", passportStrategies.registerStrategy);
///******************************************************************************* */
//console.log(args.mode)
if (args.mode === "fork") await dbInit();
const cpus = os.cpus(); //get all cpus cores on the server
if ((cluster.isPrimary) && (args.mode === "cluster")) {
    await dbInit();
    console.log(`
    CPUS: ${cpus.length}
    Primary PID: ${process.pid}
    `);
    cpus.map(() => {
        cluster.fork();
    });

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((data) => {
            done(null, data);
        })
            .catch((err) => { console.error(err); })
    });

    app.use("/", urlRegister, router);
    app.use(invalidUrl);
    const expressServer = app.listen(process.env.PORT || 3000, () =>
        console.log('Server listening on port :' + process.env.PORT + ' Mode: ' + args.mode)
    );
    app.on("error", (err) => {
        console.log(err)
    })
    const io = new IOServer(expressServer);

    io.on("connection", async (socket) => {

        try {
            console.log(`New client connection ${socket.id}`);

            // send product for new client
            socket.emit("server:products", await dbProducts.getAll());

            // listen products from clients
            socket.on("client:productData", async (productData) => {
                try {
                    // update product DB
                    productData.price = parseInt(productData.price)
                    await dbProducts.save(productData)

                    // send product to all clients
                    io.emit("server:products", await dbProducts.getAll());
                } catch (err) {
                    console.log(err)
                    errorLogger().error(`Error on the application: ${err}`)
                }
            });
            //send chat message for new user
            socket.emit("server:message", await dbChats.getAll());

            // listen new message from chat
            socket.on("client:message", async (messageInfo) => {
                try {
                    // update message array
                    await dbChats.save(messageInfo)
                    // send message to all users
                    io.emit("server:message", await dbChats.getAll());
                } catch (err) {
                    console.log(err)
                    errorLogger().error(`Error on the application: ${err}`)
                }
            });
        } catch (err) {
            console.log(err)
            errorLogger().error(`Error on the application: ${err}`)
        }
    });
}
