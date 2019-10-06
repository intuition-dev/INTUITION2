

export class SysInfo { // agent
    static si = require('systeminformation')

    info() { // rare, like day
        console.log('info')


        if(true) return

        SysInfo.si.networkConnections().then(data => console.log(data))

        SysInfo.si.processes().then(data => console.log(data))

        SysInfo.si.networkInterfaces().then(data => console.log(data))

        SysInfo.si.fsSize().then(data => console.log(data))

        SysInfo.si.blockDevices().then(data => console.log(data))

        SysInfo.si.osInfo().then(data => console.log(data))

        SysInfo.si.users().then(data => console.log(data))



    }//()

    ping() { // often like 1 second
        console.log('ping')

        if(true) return

        //files open
        SysInfo.si.fsOpenFiles().then(data => console.log(data))

        SysInfo.si.networkInterfaceDefault().then(data => console.log(data))
        SysInfo.si.networkStats('en0').then(data => console.log(data))

        SysInfo.si.fsStats().then(data => console.log(data))


        SysInfo.si.disksIO().then(data => console.log(data))

        SysInfo.si.mem().then(data => console.log(data))
    
        SysInfo.si.currentLoad().then(data => console.log(data))

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