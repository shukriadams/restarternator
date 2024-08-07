
   
module.exports = {
    
    worker: null,
    
    busy: false,

    async start(){
        const CronJob = require('cron').CronJob,
            settings = await (require('./settings')).get()

        this.worker = new CronJob(settings.daemonCron, this.work.bind(this), null, true, null, null, true /*runonitit*/)
    },

    async work(){
        const log = await (require('./log')).get(),
            settings = await (require('./settings')).get(),
            timebelt = require('timebelt'),
            deviceController = require('./../lib/shellys')

        try 
        {
            if (this.busy)
                return
            
            this.busy = true
            let calls = 0

            for (let p in settings.devices){
                let deviceConfig = settings.devices[p]
                
                if (!deviceConfig.enabled)
                    continue
                
                if (deviceConfig.status.pauseUpdates)
                    if (device.lastCommand && timebelt.secondsDifference(new Date, device.lastCommand) > device.drainTime * 1000) {
                        deviceConfig.status.pauseUpdates = false
                    } else {
                        continue
                    }

                (async (deviceConfig)=>{
                    try {
                        calls ++
                        let result = await deviceController.getStatus(deviceConfig)

                        deviceConfig.status.statePending = false
                        const previousReachable = deviceConfig.status.reachable,
                            firstRead = deviceConfig.status.initializing

                        deviceConfig.status.initializing = false
                        
                        if (result.success){
                            deviceConfig.status.failedAttempts = 0
                            deviceConfig.status.reachable = true
                            deviceConfig.status.description = result.description
                            deviceConfig.status.lastResponseTime = new Date()
                            deviceConfig.status.lastResponse = result.raw
                            deviceConfig.status.poweredOn = result.poweredOn === true
                            deviceConfig.status.showAsOn = result.showAsOn === true
                            deviceConfig.status.powerUse = result.powerUse
                        } else {
                            deviceConfig.status.failedAttempts ++
                            deviceConfig.status.reachable = false
                            deviceConfig.status.description = 'Device currently not reachable'
                        }
                        
                        if (!firstRead && previousReachable != deviceConfig.status.reachable)
                            log.info(`Device ${deviceConfig.name} reachability changed, reading is ${JSON.stringify(result)} `)


                    } catch(ex) {        
                        log.error(ex)
                    } finally {
                        calls --
                    }
                })(deviceConfig)

                // wait for all device calls to exit
                while(calls > 0)
                    await timebelt.pause(100)
            }
        } 
        catch(ex)
        {
            log.error(ex) 
        }
        finally
        {
            this.busy = false   
        }
    }
}