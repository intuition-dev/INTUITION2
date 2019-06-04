"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const opn = require('opn');
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
const config_port = 3100;
const config_url = ['localhost'];
const appE = Serv_1.ExpressRPC.makeInstance(config_url);
appE.use(bodyParser.json());
appE.use(bodyParser.text());
appE.use(bodyParser.urlencoded({ extended: true }));
appE.use(Serv_1.ExpressRPC.serveStatic('setup'));
var db;
appE.post("/", (req, res) => {
    const method = req.fields.method;
    let resp = {};
    if ('get' == method) {
        resp.result = {};
        res.sendFile('/src/setup/index.html');
    }
    else {
        return res.json(resp);
    }
});
appE.post("/setup", async (req, res) => {
    const method = req.fields.method;
    console.info("--req.fields:", req.fields);
    let params = JSON.parse(req.fields.params);
    let email = params.email;
    let password = params.password;
    let emailjs = params.emailjs;
    let resp = {};
    if ('setup' == method) {
        resp.result = {};
        try {
            await createNewADBwSchema('adminEmail', 'emailJsCode');
            await db.run('CREATE TABLE admin(email,pass,emailJsCode)');
            await db.run(`INSERT INTO admin(email, pass, emailJsCode) VALUES('${email}', '${password}', '${emailjs}')`, function (err) {
                if (err) {
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
            await createNewADBwSchema('adminEmail', 'emailJsCode');
            db.run('DROP TABLE config');
        }
        catch (err) {
        }
    }
    else {
        return res.json(resp);
    }
});
async function createNewADBwSchema(adminEmail, emailJsCode) {
    const dbPro = sqlite.open('./db/ADB.sqlite');
    db = await dbPro;
    db.configure('busyTimeout', 2 * 1000);
}
appE.listen(config_port, () => {
});
