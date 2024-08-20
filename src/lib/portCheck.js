module.exports = {
    async check(host, port){
        const NetcatClient = require('netcat/client')

        return new Promise((resolve, reject)=>{
            try {
                const nc = new NetcatClient()
                nc.addr(host).scan(port, ports =>{
                    if (ports[port] === 'open')
                        return resolve(true)

                    resolve(false)
                })
            } catch(ex) {
                reject(ex)
            }
        })        
    }
}