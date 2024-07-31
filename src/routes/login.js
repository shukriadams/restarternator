module.exports = express => {

    express.get('/login', async (req, res)=>{
        const log = await (require('./../lib/log')).get()

        try {
            const handlebarsLoader = require('madscience-handlebarsloader'),
                view = await handlebarsLoader.getPage('login')

            res.send(view())
           
        } catch (ex){
            log.error(ex)
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}