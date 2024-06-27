(async()=>{
    const Express = require('express'),
        handlebarsLoader = require('madscience-handlebarsloader'),
        http = require('http'),
        settings = require('./lib/settings').get(),
        express = Express(),
        path = require('path'),
        fs = require('fs-extra')
        
    express.set('json spaces', 4)

    handlebarsLoader.initialize({ 
        forceInitialize : !settings.cacheViews,
        helpers : `${__dirname}/views/helpers`,
        pages : `${__dirname}/views/pages`,
        partials : `${__dirname}/views/partials`,
    })

    routeFiles = await fs.readdir(path.join(__dirname, 'routes'))

    for (const routeFile of routeFiles){
        const routeFileName = routeFile.match(/(.*).js/).pop(),
            route = require(`./routes/${routeFileName}`)

        route(express)
    }

    let server = http.createServer(express)
    server.listen(settings.port)
    console.log(`Server started, listening on port ${settings.port}`)
})()