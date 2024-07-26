module.exports = express => {

    express.get('/test', async (req, res)=>{
        try {

            res.end('passing')

        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })
}