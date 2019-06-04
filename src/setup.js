"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const opn = require('opn');
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
const bcrypt = require('bcryptjs');
const fs = require('fs');
const pathToDb = 'ADB.sqlite';
const config_port = 3100;
const config_url = ['localhost'];
const appE = Serv_1.ExpressRPC.makeInstance(config_url);
appE.use(bodyParser.json());
appE.use(bodyParser.text());
appE.use(bodyParser.urlencoded({ extended: true }));
var db;
try {
    if (fs.existsSync(pathToDb)) {
        console.log('---db exist already---');
        appE.use(Serv_1.ExpressRPC.serveStatic('.'));
    }
    else {
        fs.writeFile('ADB.sqlite', '', runSetup);
    }
}
catch (err) {
    console.error(err);
}
function runSetup() {
    appE.use(Serv_1.ExpressRPC.serveStatic('setup'));
}
appE.post("/setup", async (req, res) => {
    const method = req.fields.method;
    console.info("--req.fields:", req.fields);
    let params = JSON.parse(req.fields.params);
    let email = params.email;
    console.info("--email:", email);
    let password = params.password;
    var salt = bcrypt.genSaltSync(10);
    var hashPass = bcrypt.hashSync(password, salt);
    console.info("--hashPass:", hashPass);
    let emailjs = params.emailjs;
    console.info("--emailjs:", emailjs);
    let pathToSite = params.pathToSite;
    console.info("--pathToSite:", pathToSite);
    let resp = {};
    if ('setup' == method) {
        resp.result = {};
        try {
            await createNewADBwSchema();
            await db.run(`CREATE TABLE admin(email,password,emailJsCode, pathToSite)`);
            await db.run(`INSERT INTO admin(email, password, emailJsCode, pathToSite) VALUES('${email}', '${hashPass}', '${emailjs}', '${pathToSite}')`, function (err) {
                if (err) {
                    console.log('couldnt write', err);
                }
            });
        }
        catch (err) {
        }
    }
    else {
        return res.json(resp);
    }
});
appE.post("/delete", async (req, res) => {
    const method = req.fields.method;
    let resp = {};
    if ('delete' == method) {
        resp.result = {};
        try {
            await createNewADBwSchema();
            db.run('DROP TABLE admin');
        }
        catch (err) {
        }
    }
    else {
        return res.json(resp);
    }
});
async function createNewADBwSchema() {
    const dbPro = sqlite.open('ADB.sqlite');
    db = await dbPro;
    db.configure('busyTimeout', 2 * 1000);
    console.log('connection done');
}
appE.listen(config_port, () => {
});
