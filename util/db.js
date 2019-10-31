const mysql = require('mysql2');

// connect to a database scoreboard running on your localmachine
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'scoreboard',
    password: ''
});

module.exports = pool.promise();