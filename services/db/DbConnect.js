"use strict";
exports.__esModule = true;
exports.DbConnect = void 0;
var Pool = require('pg').Pool;
var ppath = require('path');
require("dotenv").config('.env');
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
