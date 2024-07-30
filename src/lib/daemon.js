
   
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

            for (let deviceConfig of settings.devices){
                if (!deviceConfig.enabled)
                    continue
                
                (async (deviceConfig)=>{
                    try {
                        calls ++
                        let result = await deviceController.getStatus(deviceConfig)

                        if (result.success){
                            deviceConfig.status.failedAttempts = 0
                            deviceConfig.status.reachable = true
                            deviceConfig.status.description = 'Device reachable'
                            deviceConfig.status.lastResponseTime = new Date()
                            deviceConfig.status.lastResponse = result.result
                            deviceConfig.status.poweredOn = result.result.output === true
                        } else {
                            deviceConfig.status.failedAttempts ++
                            deviceConfig.status.reachable = false
                            deviceConfig.status.description = 'Device currently not reachable'
                        }

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