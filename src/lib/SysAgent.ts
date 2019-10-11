// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

export class SysAgent { // agent
    static si = require('systeminformation')

    static os = require('os')

    async ping() { // often like 1 second
        console.log('ping')

        const track =  new Object() 
        
        await SysAgent.si.services('node, pm2, mysql, caddy').then(data =>  {
            for(let o of data) 
                delete o['startmode']
            
            track['services']=data
        })

        await SysAgent.si.fsStats().then(data => { 
            track['fsR']=data.rx
            track['fsW']=data.wx
        })

        await SysAgent.si.disksIO().then(data => {
            track['ioR']=data.rIO
            track['ioW']=data.wIO
        })

        await SysAgent.si.fsOpenFiles().then(data => {
            track['openMax']=data.max
            track['openAlloc']=data.allocated
        })

        let nic 
        await  SysAgent.si.networkInterfaceDefault().then(data => {
            nic = data
            console.log('nic',data)
        })
        await SysAgent.si.networkStats(nic).then( function(data){ 
            const dat = data[0]
            track['nicR']=dat.rx_bytes
            track['nicT']=dat.tx_bytes
        })

        await SysAgent.si.mem().then(data => {
            track['memFree']=data.free
            track['memUsed']=data.used
            track['swapUsed']=data.swapused
            track['swapFree']=data.swapfree
        })

        await SysAgent.si.currentLoad().then(data => {
            track['cpu']= data.avgload
        })

        track['host']=SysAgent.os.hostname() 

        await console.log(JSON.stringify(track))
        await console.log(track)


        //wait
        await this.wait(1500)
        
    }//()

    wait(t) {
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve()
            },t)
        })
    }//()

    info() { // rare, like day
        console.log('info')

        SysAgent.si.networkConnections().then(data => console.log(data))

        SysAgent.si.processes().then(data => console.log(data))

        SysAgent.si.networkInterfaces().then(data => console.log(data))

        SysAgent.si.fsSize().then(data => console.log(data))

        SysAgent.si.blockDevices().then(data => console.log(data))

        SysAgent.si.osInfo().then(data => console.log(data))

        SysAgent.si.users().then(data => console.log(data))

    }//()

}//class

// network. geocode. ip. volume free, ports, who

// https://www.npmjs.com/package/portscanner

// https://github.com/ddsol/speedtest.net#readme

// https://www.npmjs.com/package/pcap

//https://www.npmjs.com/package/ip

// https://www.npmjs.com/package/local-devices

// https://millermedeiros.github.io/mdoc/examples/node_api/doc/os.html

// has

//