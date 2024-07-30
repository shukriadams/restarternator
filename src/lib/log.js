let _instance

module.exports = {

    async get(){
        const winstonWrapper = require('winston-wrapper'),
            settings = await (require('./settings')).get()

        if (!_instance)
            _instance = winstonWrapper.new(settings.logsDir, settings.logLevel).log

        return _instance
    }

}