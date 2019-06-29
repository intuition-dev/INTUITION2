"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
class Verx {
    static ver() {
        return 'v1.07.03';
    }
    static date() {
        return new Date().toISOString();
    }
}
exports.Verx = Verx;
const sharp = require("sharp");
const probe = require("probe-image-size");
const node_firestore_import_export_1 = require("node-firestore-import-export");
const firebase = __importStar(require("firebase-admin"));
const execa = require('execa');
const logger = require('tracer').console();
const FileHound = require("filehound");
const fs = require("fs-extra");
const yaml = require("js-yaml");
class GitDown {
    constructor(pass_) {
        var standard_input = process.stdin;
        standard_input.setEncoding('utf-8');
        console.log("Please, enter your git password.");
        standard_input.on('data', (password) => {
            if (password === 'exit\n') {
                console.log("Input failed.");
                process.exit();
            }
            else {
                console.log('password', password);
                const last = pass_.lastIndexOf('/');
                this.pass = password.replace(/\n/g, '');
                this.dir = pass_.substring(0, last);
                this.config = yaml.load(fs.readFileSync('gitdown.yaml'));
                console.log(this.dir, this.config.BRANCH);
                logger.trace(this.config);
                this.remote = 'https://' + this.config.LOGINName + ':';
                this.remote += this.pass + '@';
                this.remote += this.config.REPO + '/';
                this.remote += this.config.PROJECT;
                this._emptyFolders();
                this.process();
            }
        });
    }
    async process() {
        try {
            let b = this.config.BRANCH;
            await this._branchExists(b);
            console.log(this.exists);
            if (this.exists)
                await this._getEXISTINGRemoteBranch(b);
            else
                await this._getNEWRemoteBranch(b);
            this._moveTo(b);
        }
        catch (err) {
            console.error(err);
            process.exit();
        }
    }
    _moveTo(branch) {
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir + '/' + this.config.REPOFolder;
        let dirTo = this.config.PROJECT;
        dirTo = this.dir + '/' + this.config.LOCALFolder;
        console.log(dir, dirTo);
        fs.moveSync(dir, dirTo);
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        fs.removeSync(dirR);
        console.log('removed', dirR);
        console.log();
        fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: Verx.date() });
        console.log('DONE!');
        console.log('Maybe time to make/bake', dirTo);
        console.log('and then point http server to', dirTo);
        console.log();
        process.exit();
    }
    _emptyFolders() {
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        console.log('remove', dirR);
        fs.removeSync(dirR);
        let dirTo = this.config.PROJECT;
        dirTo = this.dir + '/' + this.config.LOCALFolder;
        console.log('remove', dirTo);
        fs.removeSync(dirTo);
    }
    async _getNEWRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        const { stdout2 } = await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir });
        const { stdout3 } = await execa('git', ['checkout', '-b', branch], { cwd: dir });
        const { stdout4 } = await execa('git', ['push', '-u', 'origin', branch], { cwd: dir });
    }
    async _getEXISTINGRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        const { stdout2 } = await execa('git', ['checkout', branch], { cwd: dir });
        console.log(dir, branch);
    }
    async _branchExists(branch) {
        let cmd = this.remote;
        cmd += '.git';
        logger.info(cmd);
        const { stdout } = await execa('git', ['ls-remote', cmd]);
        this.exists = stdout.includes(branch);
        logger.trace(stdout);
    }
}
exports.GitDown = GitDown;
class Resize {
    do(dir) {
        logger.info(dir);
        const rec = FileHound.create()
            .paths(dir)
            .ext('jpg')
            .findSync();
        let ret = [];
        for (let s of rec) {
            let n = s.slice(0, -4);
            if (n.includes('.min'))
                continue;
            ret.push(n);
        }
        for (let s of ret) {
            this.smaller(s);
        }
    }
    isWide(file) {
        let data = fs.readFileSync(file + '.jpg');
        let p = probe.sync(data);
        if (p.width && p.width > 3200)
            return true;
        logger.info(file, ' is low res');
        return false;
    }
    smaller(file) {
        logger.info(file);
        if (!this.isWide(file))
            return;
        sharp(file + '.jpg')
            .resize(1680 * 1.9)
            .jpeg({
            quality: 74,
            progressive: true,
            trellisQuantisation: true
        })
            .blur()
            .toFile(file + '.2K.min.jpg');
        sharp(file + '.jpg')
            .resize(320 * 2)
            .jpeg({
            quality: 78,
            progressive: true,
            trellisQuantisation: true
        })
            .toFile(file + '.32.min.jpg');
    }
}
exports.Resize = Resize;
class ExportFS {
    constructor(config) {
        this.users = [];
        this.args = config.split(':');
        this.serviceAccountConfig = this.args[0];
        this.pathToDataExportFile = this.args[1];
        this.pathToAuthExportFile = this.args[2];
        this.config = require(this.serviceAccountConfig + '.json');
        firebase.initializeApp({
            credential: firebase.credential.cert(this.config),
        });
        this.collectionRef = firebase.firestore();
        this.listAllUsers();
    }
    export() {
        node_firestore_import_export_1.firestoreExport(this.collectionRef)
            .then(data => {
            console.log(data);
            console.log(this.users);
            fs.writeJsonSync(this.pathToDataExportFile + '.json', data, 'utf8');
            fs.writeJsonSync(this.pathToAuthExportFile + '.json', this.users, 'utf8');
            process.exit();
        });
    }
    listAllUsers(nextPageToken) {
        const listUsersArguments = [1000];
        if (nextPageToken) {
            listUsersArguments.push(nextPageToken);
        }
        firebase.auth().listUsers(...listUsersArguments)
            .then((listUsersResult) => {
            listUsersResult.users.forEach(user => {
                this.users.push(user.toJSON());
            });
            console.log('-------------------------- this.users', this.users);
            if (listUsersResult.pageToken) {
                this.listAllUsers(listUsersResult.pageToken);
            }
            else {
                this.export();
            }
        })
            .catch(function (error) {
            console.log(error);
            process.exit();
        });
    }
}
exports.ExportFS = ExportFS;
class ImportFS {
    constructor(config) {
        this.args = config.split(':');
        this.serviceAccountConfig = this.args[0];
        this.dir = this.serviceAccountConfig.substr(0, this.serviceAccountConfig.lastIndexOf("/"));
        this.pathToDatabaseImportedFile = this.args[1];
        this.pathToAuthImportedFile = this.args[2];
        this.config = require(this.serviceAccountConfig + '.json');
        firebase.initializeApp({
            credential: firebase.credential.cert(this.config),
        });
        this.collectionRef = firebase.firestore();
        this.import();
    }
    import() {
        let _this = this;
        fs.readJson(this.pathToDatabaseImportedFile + '.json', (err, importData) => {
            console.log(err);
            node_firestore_import_export_1.firestoreImport(importData, _this.collectionRef)
                .then(() => {
                console.log('Data was imported.');
                fs.readJson(this.pathToAuthImportedFile + '.json', (err, result) => {
                    console.log(err);
                    const users = result.map(user => {
                        return Object.assign({}, user, { passwordHash: Buffer.from(user.passwordHash), passwordSalt: Buffer.from(user.passwordSalt) });
                    });
                    firebase.auth().importUsers(users, {
                        hash: {
                            algorithm: 'STANDARD_SCRYPT',
                            memoryCost: 1024,
                            parallelization: 16,
                            blockSize: 8,
                            derivedKeyLength: 64
                        }
                    })
                        .then((userImportResult) => {
                        console.log('Users Data was imported.');
                        userImportResult.errors.forEach((indexedError) => {
                            console.log(' failed to import', indexedError.error);
                        });
                        process.exit();
                    })
                        .catch((error) => {
                        console.log('error', error);
                        process.exit();
                    });
                });
            }).catch(e => {
                console.log(e);
                process.exit();
            });
        });
    }
}
exports.ImportFS = ImportFS;
module.exports = {
    Resize, ExportFS, ImportFS, GitDown, Verx
};
