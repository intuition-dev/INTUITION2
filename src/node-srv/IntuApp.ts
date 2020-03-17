
import { Serv } from 'http-rpc/lib/Serv'

import { TerseB } from "terse-b/terse-b"
    
import { IDB } from './lib/IDB';

import { VersionNag } from 'agentg/lib/FileOpsExtra';
import { BusLogic } from './lib/BusLogic';

import { EditorHandler } from './handlers/editorHandler'
import { AdminHandler } from './handlers/adminHandler'
import { UploadHandler } from './handlers/uploadHandler'

export class IntuApp extends Serv {

    log:any = new TerseB(this.constructor.name) 

    db: IDB
    uploadRoute
    configIntu

    constructor(db: IDB, origins: Array<string>, configIntu) {
        super(origins, 4 * 1024 )

        this.db = db
        this.configIntu = configIntu
        this.uploadRoute = new UploadHandler(this.db, this.configIntu)
        const THIZ = this

        VersionNag.isCurrent('intu', BusLogic.veri()).then(function (isCurrent_: boolean) {
            try {
                if (!isCurrent_)
                    THIZ.log.info('There is a newer version of intu(INTUITION.DEV), please update.')
            } catch (err) {
                THIZ.log.warn(err)
            }
        })// 
    }//()

   start(intuPath) {
        const THIZ = this
        Serv._expInst.use(function (req, res, next) {
            THIZ.log.info("--req.url", req.url)
            next()
        })

        // await this.db.isSetupDone()
        // order of Handler: api, all intu apps, Web App
        this.log.info('----running')
        //1 API
        const ar = new AdminHandler(this.db, this.configIntu)
        const er = new EditorHandler(this.db, this.configIntu)

        this.routeRPC('adminAPI', ar)

        this.routeRPC('api', er )

        //Serv._expInst('/upload', this.uploadRoute.upload.bind(this.uploadRoute))

        // get version
        Serv._expInst.get('/iver', (req, res) => {
            return res.send(BusLogic.veri)
        })

        // 2 INTU
        this.serveStatic(intuPath, null, null)

    }//()


}//class
