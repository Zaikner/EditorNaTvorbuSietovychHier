const { Pool } = require('pg');
const ppath = require('path')
require("dotenv").config('.env');
console.log(process.env.DATABASE_URL)
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
class DbConnect{
  private static pool?:any = undefined;
  private constructor(){
  }

  public static get() {
      if (this.pool == undefined) {
          this.pool = new Pool({
                        connectionString: process.env.DATABASE_URL,
                        ssl: { rejectUnauthorized: false }});
      }

      return this.pool;
  }
  public static clear(){
    this.pool.end()
    this.pool = undefined
  }
}
export{DbConnect}
  // var client = DbConnect.get()

  //   client.query('select 1', (err:any, res:any) => {
  //     if (err) throw err;
  //     for (let row of res.rows) {
  //       console.log(JSON.stringify(row));
  //     }
  //   });