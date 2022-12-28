const Pool = require("pg").Pool;

const pool = new Pool({
    user : "YOUR_USERNAME",
    password : "PASSWORD",
    host : "localhost",
    port : 5432,
    database : "DATABASE_NAME"
});

module.exports = pool;
