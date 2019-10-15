// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0


var logger = require('tracer').console()
const fs = require('fs-extra')


export class BaseDBL {
   protected _fn
   protected _db

   static Database = require('better-sqlite3')

   /**
   connect with defaults
   */
   defCon(path,  fn) {
      this._fn = path + fn
      logger.trace(this._fn)
      this._db = new BaseDBL.Database(fn)

      this._db.pragma('cache_size = 5000')
      logger.trace(this._db.pragma('cache_size', { simple: true }))

      this._db.pragma('synchronous=OFF')
      this._db.pragma('count_changes=OFF')
      this._db.pragma('journal_mode=MEMORY')
      this._db.pragma('temp_store=MEMORY')

      this._db.pragma('locking_mode=EXCLUSIVE')
      logger.trace(this._db.pragma('locking_mode', { simple: true }))

      this._db.pragma('automatic_index=false')
   }

   tableExists(tab): boolean { 
      try {
         const row = this.readOne("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab)
         if(row['name'] == tab) return true
         return false
      } catch(err) {
         return false
      }   
   }//()

   // returns # of rows changed
   write(sql:string, ...args):number {
         const stmt = this._db.prepare(sql)
         const info= stmt.run(args)
         return info.changes
   }

   read(sql:string, ...args):Array<Object> {
      const stmt = this._db.prepare(sql)
      return stmt.all(args)
   }

   /**
   like read, but returns only the first row
   */
   readOne(sql:string, ...args):Object {
      const stmt = this._db.prepare(sql)
      return stmt.get(args)
   }

   BEGIN() {
      this.write('BEGIN')
   }
   COMMIT() {
      this.write('COMMIT')
   }
   ROLLBACK() {
      this.write('ROLLBACK')
   }


   fileExists() {
      return fs.existsSync(this._fn)
  }

  delDb() {
      try {
         this._db.close()
         fs.removeSync(this._fn)
   
      } catch(err) {}
  }


}//class


export  interface iDBL {
   /**
    * returns when db is setup w schema
    */
   isSetupDone():boolean
}

module.exports = {
   BaseDBL
}