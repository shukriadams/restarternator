module.exports = {
    
    async getStatus(device){
        const httpUtils = require('madscience-httputils')
            const url = `http://${device.address}/rpc/Switch.GetStatus?id=0` 

            let t = await httpUtils.downloadJSON(url)
            return t
    },

    async start(device){
        const httpUtils = require('madscience-httputils')
        const url = `http://${device.address}/rpc/Switch.Set?id=0&on=true` 
        return await httpUtils.downloadString(url)

    },

    async stop(device){
        const httpUtils = require('madscience-httputils')
        const url = `http://${device.address}/rpc/Switch.Set?id=0&on=false` 
        return await httpUtils.downloadString(url)
    }

}