module.exports = express => {

    express.get('/', async (req, res)=>{
        try {
            const handlebarsLoader = require('madscience-handlebarsloader'),
                authHelper = require('./../lib/authHelper'),
                view = await handlebarsLoader.getPage('default')

           if (!await authHelper.isSessionValid(req))
               return res.redirect('/login') 
            
            console.log('Cookies: ', req.cookies)
            
           res.end(view())

        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}