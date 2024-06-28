let yaml = require('js-yaml'),
    fs = require('fs-extra'),
    settings = {
        port: 5100,
        ticketDir : './data/tickets',
        logsDir : './data/logs',
        ad : {
            url : null,
            base : null,
            forceDomain : null // if set will be appended to username egs, user@DOMAIN.COM, if not already set
        }
    }

module.exports = {
    async get(){
        const settingsYML = './config.yml'
        if (await fs.exists(settingsYML)){
            try {
                let settingsrawYml = await fs.readFile(settingsYML, 'utf8')
                let settingsTemp = yaml.safeLoad(settingsrawYml)

                // apply yml settings to 
                settings = Object.assign(settings, settingsTemp)

                if (!settings.ad.url)
                    console.error('SETTINGS ERROR : missing ad.url')

                if (!settings.ad.base)
                    console.error('SETTINGS ERROR : missing ad.base')
            }
            catch (ex)
            {
                console.log(ex)
            }
        }


        return settings
    }
}