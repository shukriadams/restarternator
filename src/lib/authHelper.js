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

    // gets id of current session from cookie, or returns null
    async getSessionId(req){
        const cookie = req.cookies
        return cookie['restarternator-auth'] || null
    },

    // gets full session data from disk, or null
    async getSession(sessionId){
        const settings = await (require('./settings')).get(),
            sessionPath = path.join(settings.ticketDir, `${sessionId}.json`)
            
        if (await fs.exists(sessionPath))
            return fs.readJson(sessionPath)
        
        return null
    }
}