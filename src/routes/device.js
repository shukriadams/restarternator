module.exports = express => {

    express.get('/device/status/:device', async (req, res)=>{
        try {
            const path = require('path'),
                authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            device = settings.devices.find(d => d.user === session.user && d.id === req.params.device)
            if (!device){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }

            let result = await deviceController.getStatus(device),
                status = 'unavailable'
                
            if(result.output === true)
                status = 'poweredOn'
            else
                status = 'poweredOff'

            // check if device is being restarted
            const deviceFlagPath = path.join(settings.deviceFlags, `${req.params.device}.json`)
            if (await fs.exists(deviceFlagPath)){
                const flag = await fs.readJson(deviceFlagPath)
                if (flag.state == 'restarting')
                    status = 'restarting'
            }

            res.json({
                success: true,
                result : {
                    status 
                },
                message : `Device ${req.params.device} restarted`
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
        try {
            const authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            device = settings.devices.find(d => d.user === session.user && d.id === req.params.device)
            if (!device){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }

            const result = await deviceController.start(device)
           
            res.json({
                success: true,
                result,
                message : `Device ${req.params.device} restarted`
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
     * Sends a stop signal to a given device
     */
    express.post('/device/stop/:device', async (req, res)=>{
        try {
            const authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            device = settings.devices.find(d => d.user === session.user && d.id === req.params.device)
            if (!device){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }

            const result = await deviceController.stop(device)
           
            res.json({
                success: true,
                result,
                message : `Device ${req.params.device} restarted`
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
     * Sends a restart signal to a given device
     */
    express.post('/device/restart/:device', async (req, res)=>{
        try {
            const authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                timebelt = require('timebelt'),
                fs = require('fs-extra'),
                path= require('path'),
                settings = await (require('./../lib/settings')).get(),
                session = await authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            device = settings.devices.find(d => d.user === session.user && d.id === req.params.device)
            if (!device){
                res.status(403)
                return res.json({
                    success: false,
                    result: null,
                    message: `Invalid device or user does cannot interact.`
                })
            }

            const stopResult = await deviceController.stop(device)

            // write restart flag
            const deviceFlagPath = path.join(settings.deviceFlags, `${req.params.device}.json`)
            await fs.writeJson(deviceFlagPath, {
                date : new Date(),
                state: 'restarting',
                message : 'Restarting device' 
            })

            await timebelt.pause(device.restartDelay * 1000)
            try {
                const startResult = await deviceController.start(device)
            }finally{
                await fs.remove(deviceFlagPath)
            }

            res.json({
                success: true,
                result,
                message : `Device ${req.params.device} restarted`
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
}