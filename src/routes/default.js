module.exports = express => {

    express.get('/', async (req, res)=>{
        try {
            const handlebarsLoader = require('madscience-handlebarsloader'),
                authHelper = require('./../lib/authHelper'),
                view = await handlebarsLoader.getPage('default'),
                settings = await (require('./../lib/settings')).get(),
                deviceController = require('./../lib/shellys'),
                sessionId =  await authHelper.getSessionId(req)

            if (!sessionId)
                return res.redirect('/login') 
           
            let session = await authHelper.getSession(sessionId)
            if (!session)
                return res.redirect('/login') 

            let status = null,
                deviceInfo = settings.devices.find(d => d.user === session.user)
            
            let available = false,
                poweredOn = false
            
            if (deviceInfo){
                // look up device's status
                status = await deviceController.getStatus(deviceInfo.ip)
                if (status){
                    available = true
                    poweredOn = status.output
                }
            }

            res.end(view({
                device : deviceInfo,
                status : JSON.stringify(status),
                available,
                poweredOn
            }))

        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}