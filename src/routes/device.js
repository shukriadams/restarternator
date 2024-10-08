module.exports = express => {

    express.get('/device/status/:device', async (req, res)=>{
        try {
            const authHelper = require('./../lib/authHelper'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)

                return res.json({
                    error : 'not authenticated'
                })
            }

            let devicesArray = []
            for (let p in settings.devices)
                devicesArray.push(settings.devices[p])

            let device = devicesArray.find(d => d.user === session.user && d.id === req.params.device)
            
            if (!device){
                res.status(403)

                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }

            let status = 'unavailable',
                powerUse = 0
            
            if (device.status.reachable){
                if (device.status.showAsOn === true)
                    status = 'poweredOn'
                else
                    status = 'poweredOff'

                powerUse = device.status.powerUse
            }

            if (device.status.statePending)
                status = 'statePending'

            res.json({
                success: true,
                result : {
                    status,
                    description : device.status.description,
                    powerUse
                }
            })
           
        } catch (ex){
            res.status(500)
            res.json({
                success: false,
                result: ex,
                message: 'An unexpected error occurred.'
            })
        }        
    })

    /**
     * Sends a start signal to a device 
     */
    express.post('/device/start/:device', async (req, res)=>{
        const log = await (require('./../lib/log')).get()

        try {
            const authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                timebelt = require('timebelt'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            let devicesArray = []
            for (let p in settings.devices)
                devicesArray.push(settings.devices[p])

            device = devicesArray.find(d => d.user === session.user && d.id === req.params.device)
            if (!device){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }

            if (device.lastCommand && timebelt.secondsDifference(new Date, device.lastCommand ) < settings.deviceCommandDebounce){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Debounce limit hit.`
                })
            }

            settings.devices[device.id].status.statePending = true
            settings.devices[device.id].status.pauseUpdates = true
            settings.devices[device.id].lastCommand = new Date()

            try {
                // if device is already on, need to cycle first
                if (device.status.poweredOn){
                    log.info(`Starting device ${device.name}, device is already marked as up, forcing down first`)

                    device.status.descripion = 'Cycling powerstate to start'
                    const stopResult = await deviceController.stop(device)
                    await timebelt.pause(device.drainTime * 1000)
                }

                log.info(`Starting device ${device.name}, bringing up now`)
                
                device.status.descripion = 'Powering on...'
                
                const startResult = await deviceController.start(device)
                
                res.json({
                    success: true,
                    result : startResult,
                    message : `Device ${device.name} restarted`
                })

            } finally {
                settings.devices[device.id].status.pauseUpdates = false
            }
           
        } catch (ex){
            log.error(ex)
            res.status(500)
            res.json({
                success: false,
                result: ex,
                message: 'An unexpected error occurred.'
            })
        }
    })


    /**
     * Sends a stop signal to a given device
     */
    express.post('/device/stop/:device', async (req, res)=>{
        const log = await (require('./../lib/log')).get()

        try {
            const authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                timebelt = require('timebelt'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }


            let devicesArray = []
            for (let p in settings.devices)
                devicesArray.push(settings.devices[p])

            device = devicesArray.find(d => d.user === session.user && d.id === req.params.device)

            if (!device){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }

            if (device.lastCommand && timebelt.secondsDifference(new Date, device.lastCommand ) < settings.deviceCommandDebounce){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Debounce limit hit.`
                })
            }


            log.info(`Stopping device ${device.name}, bringing device down`)

            settings.devices[device.id].status.statePending = true
            settings.devices[device.id].lastCommand = new Date()

            const result = await deviceController.stop(device)
           
            res.json({
                success: true,
                result,
                message : `Device ${device.name} restarted`
            })
           
        } catch (ex){
            log.error(ex)
            res.status(500)
            res.json({
                success: false,
                result: ex,
                message: 'An unexpected error occurred.'
            })
        }
    })


    /**
     * Sends a restart signal to a given device
     */
    express.post('/device/restart/:device', async (req, res)=>{
        const log = await (require('./../lib/log')).get()
        let startResult = null

        try {
            log.info(`Received restart order for device ${req.params.device}`)
            const authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                timebelt = require('timebelt'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            let devicesArray = []
            for (let p in settings.devices)
                devicesArray.push(settings.devices[p])

            device = devicesArray.find(d => d.user === session.user && d.id === req.params.device)

            if (!device){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }
            

            if (device.lastCommand && timebelt.secondsDifference(new Date, device.lastCommand ) < settings.deviceCommandDebounce){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Debounce limit hit.`
                })
            }

            try {
                settings.devices[device.id].status.statePending = true
                settings.devices[device.id].status.pauseUpdates = true
                settings.devices[device.id].lastCommand = new Date()
    
                log.info(`Restarting for device ${device.name}, taking device down`)
                const stopResult = await deviceController.stop(device)
    
                await timebelt.pause(device.drainTime * 1000)
                

                log.info(`Restarting for device ${device.name}, bringing device up`)
                startResult = await deviceController.start(device)
            } finally {
                settings.devices[device.id].status.pauseUpdates = false
                log.info(`Unpausing updates for device ${device.name}`)
            }

            res.json({
                success: true,
                result : startResult,
                message : `Device ${device.name} restarted`
            })           
        } catch (ex){
            log.error(ex)
            res.status(500)
            res.json({
                success: false,
                result: ex,
                message: 'An unexpected error occurred.'
            })
        }
    })
}