module.exports = {
    
    async getStatus(device){
        let httpUtils = require('madscience-httputils'),
            url = `http://${device.address}/rpc/Switch.GetStatus?id=0`,
            rawJson = ''

        try 
        {
            const t = await httpUtils.downloadString(url)
            if (t.body)
            {
                rawJson = t.body
                const json = JSON.parse(t.body)
                let description = ''

                if (json.output === false){
                    description = 'Plug off'
                } else {
                    if (json.apower < device.showAsOnThreshold)
                        description = 'Plug on, device off'
                    else
                    description = 'Device on'
                }

                return {
                    success: true,
                    raw : json,
                    poweredOn : json.output === true,
                    powerUse: `${json.apower}W`,
                    description,
                    showAsOn : json.output === true && json.apower > device.showAsOnThreshold
                }
            }

        } catch(ex){
            if (rawJson)
                rawJson = `Likely JSON parse error, raw json is: ${rawJson}`

            return {
                success: false,
                error : ex, 
                desciption: `${rawJson}`
            }
        }
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