"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SysAgent {
    info() {
        console.log('info');
        if (true)
            return;
        SysAgent.si.networkConnections().then(data => console.log(data));
        SysAgent.si.processes().then(data => console.log(data));
        SysAgent.si.networkInterfaces().then(data => console.log(data));
        SysAgent.si.fsSize().then(data => console.log(data));
        SysAgent.si.blockDevices().then(data => console.log(data));
        SysAgent.si.osInfo().then(data => console.log(data));
        SysAgent.si.users().then(data => console.log(data));
    }
    ping() {
        console.log('ping');
        if (true)
            return;
        SysAgent.si.fsOpenFiles().then(data => console.log(data));
        SysAgent.si.networkInterfaceDefault().then(data => console.log(data));
        SysAgent.si.networkStats('en0').then(data => console.log(data));
        SysAgent.si.fsStats().then(data => console.log(data));
        SysAgent.si.disksIO().then(data => console.log(data));
        SysAgent.si.mem().then(data => console.log(data));
        SysAgent.si.currentLoad().then(data => console.log(data));
    }
}
exports.SysAgent = SysAgent;
SysAgent.si = require('systeminformation');
