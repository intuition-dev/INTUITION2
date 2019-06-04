import { ExpressRPC } from 'mbake/lib/Serv';
//import { ADB } from 'mbake/lib/ADB';
const opn = require('opn');
const bodyParser = require("body-parser");
import sqlite = require('sqlite')
import emailjs from 'emailjs-com' // to send a 3 char validation code
const bcrypt = require('bcryptjs') // to hash pswdws

const fs = require('fs')
const pathToDb = './db/ADB.sqlite'
const config_port = 3100

const config_url = ['localhost']
const appE = ExpressRPC.makeInstance(config_url);

appE.use(bodyParser.json());
appE.use(bodyParser.text());
appE.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express

var db

try {
    if (fs.existsSync(pathToDb)) {
        //file exists
        console.log('---db exist already---')
        appE.use(ExpressRPC.serveStatic('.'));
        //open admin and editor
    } else {
        fs.writeFile('./db/ADB.sqlite')
        appE.use(ExpressRPC.serveStatic('setup'));
    }
} catch (err) {
    console.error(err)
}

appE.post("/setup", async (req, res) => {
    const method = req.fields.method;
    console.info("--req.fields:", req.fields)
    let params = JSON.parse(req.fields.params)

    let email = params.email

    let password = params.password
    var salt = bcrypt.genSaltSync(10);
    var hashPass = bcrypt.hashSync(password, salt);

    // guid for pk client side 
    // eg: bcrypt randomBytes(16).toString("hex") or base64, or Math.random to make base64 char 16 times
    // also to email a random # 
    let emailjs = params.emailjs
    let pathToSite = params.pathToSite

    let resp: any = {}; // new response that will be set via the specific method passed
    if ('setup' == method) {
        resp.result = {}
        // res.send(resp)

        try {
            await createNewADBwSchema()
            await db.run(`CREATE TABLE admin(email,pass,emailJsCode, pathToSite)`);
            await db.run(`INSERT INTO admin(email, pass, emailJsCode, pathToSite) VALUES('${email}', '${hashPass}', '${emailjs}', ${pathToSite})`, function (err) {
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
            await createNewADBwSchema()
            db.run('DROP TABLE admin');
        } catch (err) {
            // next(err);
        }
    } else {

        return res.json(resp);

    }
});

async function createNewADBwSchema() {
    const dbPro = sqlite.open('./db/ADB.sqlite')
    db = await dbPro
    db.configure('busyTimeout', 2 * 1000)

}

appE.listen(config_port, () => {
});