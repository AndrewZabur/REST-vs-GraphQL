//Data base connection configurations.
const mysql = require('mysql');
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'andrew',
    password: 'andrew1997',
    database: 'bus_app'
});

module.exports = dbConnection;