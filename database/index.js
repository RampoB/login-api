const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Ohaliar2345YU89",
    database: "db_toko_go",
    connectionLimit:10,
    enableKeepAlive:true,
    keepAliveInitialDelay:0
});

async function query(query, value) {
    try {
        const [excecuteQuery] = await db.query(query, value ?? []);
        return excecuteQuery;
    } catch (error) {
        console.log(error);
    }
}

module.exports = query;