const timebelt = require('timebelt')
/**
  * fakes a shelly plug on network
  */
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


    /**
     * 
     */
    express.get('/rpc/Switch.Set', async (req, res)=>{
        try {
            let turnOn = req.query['on'] === 'true'

            // write to file
            const status = await fs.readJson('./static/shellys/status.json')
            status.output = turnOn
            await fs.writeJson('./static/shellys/status.json', status, {
                spaces : 4
            })

            // wait a bit to simulate delay on actual plug flipping state
            await timebelt.pause(1000)

            // todo : figure out what json shelly resturns on state flip
            res.json({
                message: 'PLACEHOLDER STUFF HERE'
            })
        } catch (ex){
            res.status(500)
            res.end(`Error : ${ex}`)
        }
    })

}