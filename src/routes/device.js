module.exports = express => {


    /**
     * Sends a start signal to a device 
     */
    express.get('/start/:device', async (req, res)=>{
        try {
            const authHelper = require('./../lib/authHelper'),
                deviceController = require('./../lib/shellys'),
                session = authHelper.getSession(req, res)

            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            await deviceController.start()
           
            res.send('')
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })


    /**
     * Sends a stop signal to a given device
     */
    express.get('/stop/:device', async (req, res)=>{
        try {

            res.send('')
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}