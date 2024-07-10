(async()=>{

    try {
        const Express = require('express'),
            handlebarsLoader = require('madscience-handlebarsloader'),
            http = require('http'),
            settings = await (require('./lib/settings')).get(),
            express = Express(),
            cookieParser = require('cookie-parser'),
            path = require('path'),
            fs = require('fs-extra')
            
        await fs.ensureDir(settings.ticketDir)
        await fs.ensureDir(settings.logsDir)

        
        express.set('json spaces', 4)

        handlebarsLoader.initialize({ 
            forceInitialize : !settings.cacheViews,
            helpers : `${__dirname}/views/helpers`,
            pages : `${__dirname}/views/pages`,
            partials : `${__dirname}/views/partials`,
        })

        routeFiles = await fs.readdir(path.join(__dirname, 'routes'))
        
        express.use(cookieParser())
        express.use(Express.urlencoded()) 
        express.use(Express.static('./static'))

        for (const routeFile of routeFiles){
            const routeFileName = routeFile.match(/(.*).js/).pop(),
                route = require(`./routes/${routeFileName}`)

            route(express)
            console.log(`Loaded route ${routeFile}`)
        }

        

        let server = http.createServer(express)
        server.listen(settings.port)
        console.log(`Server started, listening on port ${settings.port}`)

    } catch (ex) {
        console.error(ex)
    }

})()