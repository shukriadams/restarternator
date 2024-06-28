let yaml = require('js-yaml'),
    fs = require('fs-extra'),
    process = require('process'),
    allowedTypes = ['shellys'],
    settings = {
        port: 5100,
        ticketDir : './data/tickets',
        logsDir : './data/logs',
        ad : {
            url : null,
            base : null,
            forceDomain : null // if set will be appended to username egs, user@DOMAIN.COM, if not already set
        },

        devices: [

        ]
    },
    deviceTemplate = {
        'name': null,
        'user': null,               // unique, fixed user id, from auth system.
        'ip': null,
        'type' : 'shellys',         // allowed values : shellys
        'restartDelay': 20,
        'enabled': true        
    }

module.exports = {
    async get(){
        const settingsYML = './config.yml'

        if (await fs.exists(settingsYML)){
            let settingsrawYml = await fs.readFile(settingsYML, 'utf8')
            let settingsTemp = yaml.safeLoad(settingsrawYml)

            // apply yml settings to base settings object 
            settings = Object.assign(settings, settingsTemp)

            // apply default device values + structure to devices
            let errors = false
            for (let i = 0; i < settings.devices.length ; i ++){
                settings.devices[i] = Object.assign(deviceTemplate, settings.devices[i])
                
                // verify settings
                const device = settings.devices[i]
                if (!device.name){
                    console.error(`Device ${JSON.stringify(device)} has no name`)
                    errors = true
                }

                if (!device.user){
                    console.error(`Device ${JSON.stringify(device)} has no user`)
                    errors = true
                }

                if (!device.ip){
                    console.error(`Device ${JSON.stringify(device)} has no ip`)
                    errors = true
                }

                if (!allowedTypes.includes(device.type)){
                    console.error(`Device ${JSON.stringify(device)} has an invalid type. Allowed types are ${allowedTypes}`)
                    errors = true
                }
            }

            if (errors)
                throw `Config errors found`

            if (!settings.ad.url)
                console.error('SETTINGS ERROR : missing ad.url')

            if (!settings.ad.base)
                console.error('SETTINGS ERROR : missing ad.base')
        }


        return settings
    }
}