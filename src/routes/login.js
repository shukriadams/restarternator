module.exports = express => {

    express.get('/login', async (req, res)=>{
        try {
            const handlebarsLoader = require('madscience-handlebarsloader'),
                view = await handlebarsLoader.getPage('login')

            res.send(view())
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })

    express.post('/login', async (req, res)=>{
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
                    console.log('ERROR: '+JSON.stringify(err));
                    console.log(res)
                    return res.send(view({
                        error : res
                    }))
                }

                if (auth) {
                    const sessionId = await authHelper.createSession(user)
                    res.cookie('restarternator-auth', sessionId, { maxAge: 9999999999999, httpOnly: true })
                    return res.redirect('/')
                } else {
                    console.log('Authentication failed!');
                    return res.send(view({
                        error : 'auth failed'
                    }))
                }
            })
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}