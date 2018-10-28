var mysql = require ('mysql')

var pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "jaRJarbin0923K2r3for1%win",
    database: "magic",
    waitForConnections: false
});

module.exports = pool;