module.exports = express => {

    express.get('/', async (req, res)=>{
        try {
            const handlebarsLoader = require('madscience-handlebarsloader'),
                authHelper = require('./../lib/authHelper'),
                view = await handlebarsLoader.getPage('default'),
                settings = await (require('./../lib/settings')).get(),
                deviceController = require('./../lib/shellys'),
                session =  await authHelper.getSession(req)

            if (!session)
                return res.redirect('/login') 

            let status = null,
                devices = settings.devices.filter(d => d.user === session.user)
            
            for (let device of devices){
                // look up device's status
                let status = await deviceController.getStatus(device)
                if (status){
                    device.available = true
                    device.poweredOn = status.output
                }
            }

            res.end(view({
                devices,
                status : JSON.stringify(status)
            }))

        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}