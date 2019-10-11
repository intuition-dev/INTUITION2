// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

export class SysAgent { // agent
    static si = require('systeminformation')

    info() { // rare, like day
        console.log('info')


        if(true) return

        SysAgent.si.networkConnections().then(data => console.log(data))

        SysAgent.si.processes().then(data => console.log(data))

        SysAgent.si.networkInterfaces().then(data => console.log(data))

        SysAgent.si.fsSize().then(data => console.log(data))

        SysAgent.si.blockDevices().then(data => console.log(data))

        SysAgent.si.osInfo().then(data => console.log(data))

        SysAgent.si.users().then(data => console.log(data))



    }//()

    ping() { // often like 1 second
        console.log('ping')

        if(true) return

        //files open
        SysAgent.si.fsOpenFiles().then(data => console.log(data))

        SysAgent.si.networkInterfaceDefault().then(data => console.log(data))
        SysAgent.si.networkStats('en0').then(data => console.log(data))

        SysAgent.si.fsStats().then(data => console.log(data))


        SysAgent.si.disksIO().then(data => console.log(data))

        SysAgent.si.mem().then(data => console.log(data))
    
        SysAgent.si.currentLoad().then(data => console.log(data))

    }//()
}//class

// network. geocode. ip. volume free, ports, who

// message pack compression

// https://www.npmjs.com/package/portscanner

// https://github.com/ddsol/speedtest.net#readme

// https://www.npmjs.com/package/pcap

//https://www.npmjs.com/package/ip

// https://www.npmjs.com/package/local-devices

// https://millermedeiros.github.io/mdoc/examples/node_api/doc/os.html