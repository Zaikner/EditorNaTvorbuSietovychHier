const { Client } = require('pg');
const ppath = require('path')
require("dotenv").config('.env');
console.log(process.env.DATABASE_URL)
//https://www.youtube.com/watch?v=M9RDYkFs-EQ&t=28s
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
 
});

client.connect();

client.query('SELECT 1;', (err:any, res:any) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
