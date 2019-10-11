// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

const logger = require('tracer').console()
const fs = require('fs-extra')
const sqlite3 = require('sqlite3').verbose()

/**
 * Helper for SQLite3
 */
export class BaseDBL {

   path
   fn
   protected db

   constructor(path, fn) {
      this.path = path
      this.fn = fn
   }

   fileExists() {
      return fs.existsSync(this.path + this.fn)
  }

  delDb() {
      try {
            this.db.close(function() {
            fs.removeSync(this.path + this.fn)
          })
      } catch(err) {}

  }

async tableExists(tab): Promise<any> { 
   try {
      this.con()

      const qry = this.db.prepare("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab)
      const rows = await this._qry(qry)
      logger.trace('exits?', rows)
      const row = rows[0]
      if(row.name == tab) return true
      return false
   } catch(err) {
       return false
   }   
}//()


  con() {
      if (this.db) {
          logger.trace('connection exists')
          return
      }
      logger.trace('new connection')
      this.db = new sqlite3.Database(this.path + this.fn)
  }//()

  
   protected _run(stmt, ...args):Promise<any> {
      return new Promise( function (resolve, reject) {
         try {
         stmt.run( args
            , function (err) {
               if (err) {
                  logger.trace(err)
                  reject(err)
               }
               else resolve('OK')
            })
         } catch(err) {
            logger.warn(err)
            reject(err)
         }
      })

   }//()

   protected _qry(stmt, ...args):Promise<any> {
      return new Promise( function (resolve, reject) {
         try {
         stmt.all( args
            , function (err, rows) {
               if (err) {
                  logger.trace(err)
                  reject(err)
               }
               else resolve(rows)
            })
         } catch(err) {
            logger.warn(err)
            reject(err)
         }
      })
   }//()

}//class


export  interface iDBL {
   /**
    * returns when db is setup
    */
   isSetupDone():Promise<boolean> 

}

module.exports = {
   BaseDBL
}