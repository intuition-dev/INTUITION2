"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require('tracer').console();
class SysAgent {
    static async stats() {
        const track = new Object();
        track['guid'] = SysAgent.guid();
        track['dt_stamp'] = new Date().toISOString();
        await SysAgent.si.fsStats().then(data => {
            track['fsR'] = data.rx;
            track['fsW'] = data.wx;
        });
        await SysAgent.si.disksIO().then(data => {
            track['ioR'] = data.rIO;
            track['ioW'] = data.wIO;
        });
        await SysAgent.si.fsOpenFiles().then(data => {
            track['openMax'] = data.max;
            track['openAlloc'] = data.allocated;
        });
        let nic;
        await SysAgent.si.networkInterfaceDefault().then(data => {
            nic = data;
        });
        await SysAgent.si.networkStats(nic).then(function (data) {
            const dat = data[0];
            track['nicR'] = dat.rx_bytes;
            track['nicT'] = dat.tx_bytes;
        });
        await SysAgent.si.mem().then(data => {
            track['memFree'] = data.free;
            track['memUsed'] = data.used;
            track['swapUsed'] = data.swapused;
            track['swapFree'] = data.swapfree;
        });
        await SysAgent.si.currentLoad().then(data => {
            track['cpu'] = data.currentload;
            track['cpuIdle'] = data.currentload_idle;
        });
        track['host'] = SysAgent.os.hostname();
        return track;
    }
    static wait(t) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, t);
        });
    }
}
exports.SysAgent = SysAgent;
SysAgent.guid = require('uuid/v4');
SysAgent.si = require('systeminformation');
SysAgent.os = require('os');
