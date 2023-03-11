//COnfiguration for My SQL database Version

/* const config = {
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "28158598",
        database: "coderhouse",
    },
    pool: { min: 0, max: 7 },
}; */

const config = {
    client: "mysql",
    connection: {
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
    },
    pool: { min: 0, max: 7 },
};

export default config;
