let yaml = require('js-yaml'),
    fs = require('fs-extra'),
    crypto = require('crypto'),
    allowedTypes = ['shellys'],
    _instance = null,
    settings = {
        port: 5100,
        // info be error|warn|info|debug in increasing levels of spamminess.
        logLevel: 'info',
        ticketDir : './data/tickets',
        logsDir : './data/logs',
        deviceFlags : './data/deviceFlags',
        daemonCron: '*/10 * * * * *', // 10 seconds
        ad : {
            url : null,
            base : null,
            forceDomain : null // if set will be appended to username egs, user@DOMAIN.COM, if not already set
        },

        devices: [

        ]
    },
    deviceTemplate = {
        id : null,                  // calculated at runtime, hash of name+user
        name: null,                 // REQUIRED. Cosmetic
        user: null,                 // REQUIRED. fixed user id, from auth system.
        address: null,              // REQUIRED. IP:PORT of device
        type: 'shellys',            // allowed values : shellys
        restartDelay: 20,           // OPTIONAL. Dealy, in seconds, between device stop and start
        enabled: true,              // OPTIONAL.
        available: false,           // calculated at runtime   
        poweredOn : false,          // calculated at runtime

        status:  {                  // last retrieved status of device, set by daemon
            failedAttempts : 0,     // nr of times contact has failed
            lastResponse: null,     // object last retrieved from device
            lastResponseTime: null,  // time last object was successfully polled
            poweredOn: false,
            reachable: false,
            descripion: ''          // short status description written by daemon
        }
    }

module.exports = {
    async get(){
        const settingsYML = './config.yml'

        if (!!_instance)
            return _instance

        if (await fs.exists(settingsYML)){
            let settingsrawYml = await fs.readFile(settingsYML, 'utf8')
            let settingsTemp = yaml.safeLoad(settingsrawYml)

            // apply yml settings to base settings object 
            settings = Object.assign(settings, settingsTemp)

            // apply default device values + structure to devices
            let errors = false
            for (let i = 0; i < settings.devices.length ; i ++){
                settings.devices[i] = Object.assign(JSON.parse(JSON.stringify(deviceTemplate)) , settings.devices[i])
                
                // calculate id
                settings.devices[i].id = crypto.createHash('md5').update(`${settings.devices[i].name}_${settings.devices[i].user}`).digest('hex')

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

                if (!device.address){
                    console.error(`Device ${JSON.stringify(device)} has no address`)
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
        
        _instance = settings

        return _instance
    }
}