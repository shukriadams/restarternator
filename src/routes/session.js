

module.exports = express => {

    express.delete('/session', async (req, res)=>{
        const log = await (require('./../lib/log')).get()

        try {
            const authHelper = require('./../lib/authHelper'),
                session = await authHelper.getSession(req)

            if (session)
                await authHelper.deleteSession(session, res)
            
            return res.redirect('/') 

        } catch (ex){
            log.error(ex)
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })

    express.post('/session', async (req, res)=>{
        const log = await (require('./../lib/log')).get()

        try {
            let handlebarsLoader = require('madscience-handlebarsloader'),
                settings = await (require('./../lib/settings')).get(),
                ActiveDirectory = require('activedirectory'),
                ad = new ActiveDirectory(settings.ad),
                authHelper = require('./../lib/authHelper'),
                view = await handlebarsLoader.getPage('login'),
                user = (req.body['user'] || '').trim(),
                password = (req.body['password'] || '').trim()

            if (!user || !password)
                return res.send(view({
                    error : 'user and password required'
                }))
            
            if (!user.includes('@') && settings.ad.forceDomain)
                user = `${user}@${settings.ad.forceDomain}`

            ad.authenticate(user, password, async(err, auth) => {
                if (err) {
                    log.error('ERROR: '+JSON.stringify(err));
                    log.error(res)
                    return res.send(view({
                        error : res
                    }))
                }

                if (auth) {
                    const sessionId = await authHelper.createSession(user, res)
                    return res.redirect('/')
                } else {
                    log.error('Authentication failed!');
                    return res.send(view({
                        error : 'auth failed'
                    }))
                }
            })
           
        } catch (ex){
            log.error(ex)
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}