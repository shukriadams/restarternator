module.exports = express => {

    express.get('/', async (req, res)=>{
        try {
            const handlebarsLoader = require('madscience-handlebarsloader'),
                authHelper = require('./../lib/authHelper'),
                view = await handlebarsLoader.getPage('default'),
                settings = await (require('./../lib/settings')).get(),
                session =  await authHelper.getSession(req)

            if (!session)
                return res.redirect('/login') 

            let devicesArray = []
            for (let p in settings.devices)
                devicesArray.push(settings.devices[p])

            let devices = devicesArray.filter(d => d.user === session.user)

            res.end(view({
                devices
            }))

        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}