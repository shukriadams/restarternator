module.exports = express => {


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
                sucess: true,
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
                sucess: true,
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
    express.post('/device/restart/:device', async (req, res)=>{
        try {
            res.json({
                sucess: true,
                result : null,
                message : `NOT IMPLEMENTED YET`
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