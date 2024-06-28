module.exports = express => {

    express.get('/rpc/Switch.GetStatus', async (req, res)=>{

        try {
            const fs = require('fs-extra')
            const status = await fs.readJson('./static/shellys/status.json')

            res.json(status)
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })

    express.get('/rpc/Switch.Set', async (req, res)=>{
        try {
            res.end('')
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })

}