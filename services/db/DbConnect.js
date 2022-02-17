"use strict";
exports.__esModule = true;
exports.DbConnect = void 0;
var Pool = require('pg').Pool;
var ppath = require('path');
require("dotenv").config('.env');
console.log(process.env.DATABASE_URL);
//https://www.youtube.com/watch?v=M9RDYkFs-EQ&t=28s
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// });
// client.connect();
//   client.query('select * from public."Dd"', (err:any, res:any) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   });
var DbConnect = /** @class */ (function () {
    function DbConnect() {
    }
    DbConnect.get = function () {
        if (this.pool == undefined) {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false }
            });
        }
        return this.pool;
    };
    DbConnect.clear = function () {
        this.pool.end();
        this.pool = undefined;
    };
    DbConnect.pool = undefined;
    return DbConnect;
}());
exports.DbConnect = DbConnect;
// var client = DbConnect.get()
//   client.query('select 1', (err:any, res:any) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//   });
