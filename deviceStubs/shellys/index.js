(async()=>{

    try {
        const Express = require('express'),
            http = require('http'),
            express = Express(),
            fs = require('fs-extra')

        express.get('/rpc/Switch.GetStatus', async (req, res)=>{
            try {
                const status = await fs.readJson('./status.json')
                res.json(status)
            } catch (ex){
                res.status(500)
                res.end(`Error : ${ex}`)
            }
        })
       
        express.get('/rpc/Switch.Set', async (req, res)=>{
            try {
                let turnOn = req.query['on'] === 'true'
    
                // write to file
                const status = await fs.readJson('./status.json')
                status.output = turnOn

                await fs.writeJson('./status.json', status, {
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

        let server = http.createServer(express)
        server.listen(5111)
        console.log(`Shelly started, listening on port 5111`)

    } catch (ex) {
        console.error(ex)
    }

})()