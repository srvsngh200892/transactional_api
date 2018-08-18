'use strict';

async function dbConnection() {
    const db = require('mysql2/promise');

    try {

        let dbConfig = {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        }

        return await db.createConnection(dbConfig);

    } catch (error) {
        console.log('connection error!', error);
    }
}

module.exports = {dbConnection};
