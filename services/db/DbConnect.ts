const { Pool } = require('pg');
const ppath = require('path')
require("dotenv").config('.env');

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
