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
            const handlebarsLoader = require('madscience-handlebarsloader'),
                { ActiveDirectory } = require('node-ad-tools'),
                settings = await (require('./../lib/settings')).get(),
                authHelper = require('./../lib/authHelper'),
                view = await handlebarsLoader.getPage('login'),
                ad = new ActiveDirectory(settings.ad)
                user = (req.body['user'] || '').trim(),
                password = (req.body['password'] || '').trim()

            if (!user || !password)
                return res.send(view({
                    error : 'user and password required'
                }))
            
                var ActiveDirectory2 = require('activedirectory');
                var ad2 = new ActiveDirectory2(settings.ad);
                // Authenticate
                ad2.authenticate(user, password, function(err, auth) {
                    if (err) {
                        console.log('ERROR: '+JSON.stringify(err));
                        return;
                    }
                    if (auth) {
                        console.log('Authenticated!');
                    }
                    else {
                        console.log('Authentication failed!');
                    }
                });

            ad.loginUser(user, password)
                .then(res => {

                    if(!res.success) {
                        console.log(res)
                        return res.send(view({
                            error : res
                        }))
                    }

                    const sessionId =  authHelper.createSession(user)
                    res.cookie('restarternator-auth', sessionId, { maxAge: 900000, httpOnly: true })
                
                    return res.direct('/')
                })
                .catch(err => {
                    return res.send(view({
                        error : err
                    }))
                })
           
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}