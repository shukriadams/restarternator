const path = require('path')
    fs = require('fs-extra')

module.exports = {

    async createSession(user,res ){
        const settings = await (require('./settings')).get(),
            { v4: uuidv4 } = require('uuid'),
            sessionId = uuidv4(),
            sessionPath = path.join(settings.ticketDir, `${sessionId}.json`)

        res.cookie('restarternator-auth', sessionId, { maxAge: 9999999999999, httpOnly: true })

        await fs.writeJson(sessionPath, {
            date : new Date(),
            user,
            sessionId
        })

        return sessionId
    },

    async deleteSession(session, req){
        const settings = await (require('./settings')).get(),
            sessionPath = path.join(settings.ticketDir, `${session.sessionId}.json`)

        if (await fs.exists(sessionPath))
            await fs.remove(sessionPath)

        res.cookie('restarternator-auth', sessionId, { maxAge: 9999999999999, httpOnly: true })
    },

    // gets full session data from disk, or null
    async getSession(req){
        const settings = await (require('./settings')).get(),
            cookie = req.cookies,
            sessionId = cookie['restarternator-auth'] || null

        if (!sessionId)
            return null

        const sessionPath = path.join(settings.ticketDir, `${sessionId}.json`)
            
        if (await fs.exists(sessionPath))
            return fs.readJson(sessionPath)
        
        return null
    }

}