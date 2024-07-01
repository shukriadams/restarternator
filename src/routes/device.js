module.exports = express => {

    /**
     * 
     */
    express.get('/start', async (req, res)=>{
        try {
            const authHelper = require('./../lib/authHelper'),
                sessionId =  await authHelper.getSessionId(req),
                deviceController = require('./../lib/shellys')

            if (!sessionId){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            let session = await authHelper.getSession(sessionId)
            if (!session){
                res.status(403)
                return res.json({
                    error : 'not authenticated'
                })
            }

            await deviceController()
           
            res.send('')
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })


    /**
     * 
     */
    express.get('/restart', async (req, res)=>{
        try {

            res.send('')
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })


    /**
     * 
     */
    express.get('/stop', async (req, res)=>{
        try {

            res.send('')
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}