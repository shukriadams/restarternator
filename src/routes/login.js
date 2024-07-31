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
}