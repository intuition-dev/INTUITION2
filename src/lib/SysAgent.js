"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SysAgent {
    ping() {
        console.log('ping');
        SysAgent.si.fsStats().then(data => console.log(data.rx, data.wx));
        SysAgent.si.disksIO().then(data => console.log(data.rIO, data.wIO));
        if (true)
            return;
        SysAgent.si.services('node, pm2, mysql, caddy').then(data => console.log(data));
        SysAgent.si.fsOpenFiles().then(data => console.log(data.max, data.allocated));
        SysAgent.si.networkInterfaceDefault().then(data => console.log(data));
        SysAgent.si.networkStats('en0').then(function (data) {
            const dat = data[0];
            console.log(dat.rx_bytes, dat.tx_bytes);
        });
        SysAgent.si.mem().then(data => console.log(data.free, data.used, data.swapused, data.swapfree));
        SysAgent.si.currentLoad().then(data => console.log(data.avgload));
        console.log(SysAgent.os.hostname());
    }
    info() {
        console.log('info');
        SysAgent.si.networkConnections().then(data => console.log(data));
        SysAgent.si.processes().then(data => console.log(data));
        SysAgent.si.networkInterfaces().then(data => console.log(data));
        SysAgent.si.fsSize().then(data => console.log(data));
        SysAgent.si.blockDevices().then(data => console.log(data));
        SysAgent.si.osInfo().then(data => console.log(data));
        SysAgent.si.users().then(data => console.log(data));
    }
}
exports.SysAgent = SysAgent;
SysAgent.si = require('systeminformation');
SysAgent.os = require('os');
