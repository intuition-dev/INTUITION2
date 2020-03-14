"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const terse_b_1 = require("terse-b/terse-b");
class UploadHandler {
    constructor(IDB, configIntu) {
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.db = IDB;
        this.configIntu = configIntu;
    }
    async upload(req, resp) {
        let uploadPath;
        this.log.info("TCL: UploadRoute -> upload -> req.files", req.files, req.fields.targetDir);
        if (Object.keys(req.files).length == 0) {
            return resp.status(400).send('No files were uploaded.');
        }
        if (typeof req.fields.targetDir === 'undefined') {
            return resp.status(400).send('No files were uploaded.');
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFile;
        uploadPath = this.configIntu.path + req.fields.targetDir + '/' + sampleFile.name;
        // Use the mv() method to place the file somewhere on your server
        this.log.info('sampleFile', sampleFile);
        fs.copyFile(sampleFile.path, uploadPath, (err) => {
            if (err)
                return resp.status(500).send(err);
            resp.send({ status: 'OK' });
            this.log.info(sampleFile.name + ' was copied to ' + uploadPath);
        });
    }
} //class
exports.UploadHandler = UploadHandler;
