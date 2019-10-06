"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SysInfo {
    info() {
        console.log('info');
        SysInfo.si.getStaticData().then(data => console.log(data));
        if (true)
            return;
        SysInfo.si.networkConnections().then(data => console.log(data));
        SysInfo.si.processes().then(data => console.log(data));
        SysInfo.si.networkInterfaces().then(data => console.log(data));
        SysInfo.si.fsSize().then(data => console.log(data));
        SysInfo.si.blockDevices().then(data => console.log(data));
        SysInfo.si.osInfo().then(data => console.log(data));
        SysInfo.si.users().then(data => console.log(data));
    }
    ping() {
        console.log('ping');
        if (true)
            return;
        SysInfo.si.fsOpenFiles().then(data => console.log(data));
        SysInfo.si.networkInterfaceDefault().then(data => console.log(data));
        SysInfo.si.networkStats('en0').then(data => console.log(data));
        SysInfo.si.fsStats().then(data => console.log(data));
        SysInfo.si.disksIO().then(data => console.log(data));
        SysInfo.si.mem().then(data => console.log(data));
        SysInfo.si.currentLoad().then(data => console.log(data));
    }
}
exports.SysInfo = SysInfo;
SysInfo.si = require('systeminformation');
