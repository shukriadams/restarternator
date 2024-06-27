const path = require('path')
    fs = require('fs-extra')

module.exports = {

    async createSession(user, ){
        const settings = await (require('./settings')).get(),
            { v4: uuidv4 } = require('uuid'),
            sessionId = uuidv4(),
            sessionPath = path.join(settings.ticketDir, `${sessionId}.json`)

        await fs.writeJson(sessionPath, {
            date : new Date(),
            user,
            sessionId
        })

        return sessionId
    },

    async deleteSession(sessionId){
        const settings = await (require('./settings')).get(),
            sessionPath = path.join(settings.ticketDir, `${sessionId}.json`)

        if (await fs.exists(sessionPath))
            await fs.delete(sessionPath)
    },

    async isSessionValid(req){
        const cookie = req.cookies
        if (!cookie['restarternator-auth'])
            return false;

        const sessionId = cookie['restarternator-auth']
        const settings = await (require('./settings')).get(),
            sessionPath = path.join(settings.ticketDir, `${sessionId}.json`)
            
        return await fs.exists(sessionPath)
    }
}