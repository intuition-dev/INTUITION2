
const logger = require('tracer').console()

/**
 * Helper for SQLite3
 */
export class BaseDB {

   protected _run(stmt, ...args):Promise<any> {
      return new Promise( function (resolve, reject) {
         stmt.run( args
            , function (err) {
               if (err) {
                  logger.trace(err)
                  reject(err)
               }
               else resolve('okr')
            })
      })
   }//()

   protected _qry(stmt, ...args):Promise<any> {
      return new Promise( function (resolve, reject) {
         stmt.all( args
            , function (err, rows) {
               if (err) {
                  logger.trace(err)
                  reject(err)
               }
               else resolve(rows)
            })
      })
   }//()

}//class

module.exports = {
   BaseDB
}