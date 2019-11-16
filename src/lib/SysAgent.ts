// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

const find = require('find-process')

export class SysAgent { 
    static guid = require('uuid/v4')

    static si = require('systeminformation')

    static os = require('os')

    static async ports() { 
      let ports = []
      await SysAgent.si.networkConnections().then(data => { 
         data.forEach(function(v){
            ports.push(v.localport)
         }) 
      })

      let results = []
      for (let i = 0; i < ports.length; i++) {
         let row = await find('port', ports[i])
            row = row[0]
            row['port'] = ports[i]
            delete row['ppid']
            delete row['uid']
            delete row['gid']
            delete row['cmd']
            delete row['bin']
            results.push(row)
         }

      console.log(results)
      return results
   }//()

    static async stats() { // often like 1 second
        const track =  new Object() 
        track['guid']= SysAgent.guid()
        track['dt_stamp']= new Date().toISOString()

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
            track['cpu']= data.currentload
            track['cpuIdle']= data.currentload_idle
        })

        track['host']=SysAgent.os.hostname() 
        
        return track
     
    }//()

    static wait(t):Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve()
            },t)
        })
    }//()

}//class

