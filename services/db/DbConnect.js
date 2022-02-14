var Client = require('pg').Client;
var ppath = require('path');
require("dotenv").config('.env');
// process.env.DATABASE_URL = 'postgres://hwufnlwhcjuiqt:1d30d4f4a8e47cd8794db6ec68912f1e581a73603dbe4a033a77975a6fa945b6@ec2-63-34-153-52.eu-west-1.compute.amazonaws.com:5432/d2u7ah20m7le8o';
// //require('dotenv').config()
// console.log(process.env) // remove this after you've confirmed it working
//console.log(process.env);
console.log(process.env.DATABASE_URL);
// console.log(process.env.USER_ID)
var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
client.connect();
client.query('SELECT 1;', function (err, res) {
    if (err)
        throw err;
    for (var _i = 0, _a = res.rows; _i < _a.length; _i++) {
        var row = _a[_i];
        console.log(JSON.stringify(row));
    }
    client.end();
});
