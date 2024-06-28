module.exports = {
    
    async getStatus(ip){
        const httpUtils = require('madscience-httputils')
            const url = `http://${ip}/rpc/Switch.GetStatus?id=0` 

            let t = await httpUtils.downloadJSON(url)
            return t
    },

    async turnOn(ip){
        const httpUtils = require('madscience-httputils')
        const url = `http://${ip}/rpc/Switch.Set?id=0&on=true` 
        return await httpUtils.downloadString(url)

    },

    async turnOff(ip){
        const httpUtils = require('madscience-httputils')
        const url = `http://${ip}/rpc/Switch.Set?id=0&on=false` 
        return await httpUtils.downloadString(url)
    }

}