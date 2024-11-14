const mysql = require('mysql2/promise');
require('dotenv').config({path: '../.env' });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected as id ' + connection.threadId);
        return connection;
    } catch (err) {
        console.error('Connection failed: ' + err.stack);
        throw err;
    }
}

module.exports = createConnection;
