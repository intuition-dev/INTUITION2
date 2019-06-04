import { ExpressRPC } from 'mbake/lib/Serv';
//import { ADB } from 'mbake/lib/ADB';
const opn = require('opn');
const bodyParser = require("body-parser");
import sqlite = require('sqlite')

// const yaml = require('js-yaml');
// const fs = require('fs');
// let config = yaml.load(fs.readFileSync(__dirname + '/config.yaml'));

const config_port = 3100

const config_url = ['localhost']
const appE = ExpressRPC.makeInstance(config_url);

appE.use(bodyParser.json());
appE.use(bodyParser.text());
appE.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express
appE.use(ExpressRPC.serveStatic('setup'));
var db

appE.post("/", (req, res) => {
    const method = req.fields.method;
    let resp: any = {}; // new response that will be set via the specific method passed
    if ('get' == method) {
        resp.result = {}
        // res.send(resp)
        res.sendFile('/src/setup/index.html')
    } else {

        return res.json(resp);

    }
});

appE.post("/setup", async (req, res) => {
    const method = req.fields.method;
    console.info("--req.fields:", req.fields)
    let params = JSON.parse(req.fields.params)

    let email = params.email
    let password = params.password
    let emailjs = params.emailjs
    let resp: any = {}; // new response that will be set via the specific method passed
    if ('setup' == method) {
        resp.result = {}
        // res.send(resp)

        try {
            await createNewADBwSchema('adminEmail', 'emailJsCode')

            await db.run('CREATE TABLE admin(email,pass,emailJsCode)');
            await db.run(`INSERT INTO admin(email, pass, emailJsCode) VALUES('${email}', '${password}', '${emailjs}')`, function (err) {
                if (err) {
                }
                // get the last insert id
            });
        } catch (err) {
            // next(err);
        }
    } else {

        return res.json(resp);

    }
});

appE.post("/delete", async (req, res) => {
    const method = req.fields.method;
    let resp: any = {}; // new response that will be set via the specific method passed
    if ('delete' == method) {
        resp.result = {}
        // res.send(resp)
        try {
            await createNewADBwSchema('adminEmail', 'emailJsCode')

            db.run('DROP TABLE config');
        } catch (err) {
            // next(err);
        }
    } else {

        return res.json(resp);

    }
});

async function createNewADBwSchema(adminEmail, emailJsCode) {
    const dbPro = sqlite.open('./db/ADB.sqlite')
    db = await dbPro
    db.configure('busyTimeout', 2 * 1000)
}

appE.listen(config_port, () => {
});