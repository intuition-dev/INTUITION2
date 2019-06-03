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
    console.log('hey----------');
    if ('get' == method) {
        console.log('hey');
        resp.result = {};
        res.sendFile('/src/setup/index.html');
    }
    else {
        console.log('error', resp);
        return res.json(resp);
    }
});
appE.post("/setup", async (req, res) => {
    const method = req.fields.method;
    console.info("--method:", method);
    let resp = {};
    console.log('hey----------');
    if ('setup' == method) {
        console.log('hey');
        resp.result = {};
        try {
            await createNewADBwSchema('adminEmail', 'emailJsCode');
            await db.run('CREATE TABLE config(email,pass,emailJsCode)');
            await db.run(`INSERT INTO config(email, pass, emailJsCode) VALUES('nat@gmail.com', '123', 'emailjscodehere')`, function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            });
        }
        catch (err) {
        }
    }
    else {
        console.log('error', resp);
        return res.json(resp);
    }
});
appE.post("/delete", async (req, res) => {
    const method = req.fields.method;
    console.info("--method:", method);
    let resp = {};
    console.log('hey----------');
    if ('delete' == method) {
        console.log('hey');
        resp.result = {};
        try {
            await createNewADBwSchema('adminEmail', 'emailJsCode');
            db.run('DROP TABLE config');
        }
        catch (err) {
        }
    }
    else {
        console.log('error', resp);
        return res.json(resp);
    }
});
async function createNewADBwSchema(adminEmail, emailJsCode) {
    console.info("--adminEmail:", adminEmail);
    const dbPro = sqlite.open('./db/ADB.sqlite');
    db = await dbPro;
    db.configure('busyTimeout', 2 * 1000);
}
appE.listen(config_port, () => {
    console.info(`appE listening on port ${config_port}!`);
});
