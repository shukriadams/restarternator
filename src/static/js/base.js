(()=>{

    async function postJsonReceiveJson(url){
        return new Promise((resolve, reject)=>{
            try {
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => {
                    response.json().then(data => {
                        resolve(data)
                    }).error(err => {
                        reject(err)
                    })
                }).error(err => {
                    reject(err)
                })
            }
            catch (ex)
            {
                reject(ex)
            }
        })
    }

    async function stopDevice(deviceid){
        if (!confirm('Are you sure you want to stop this device?'))
            return

        const response = await fetch(`/device/stop/${encodeURIComponent(deviceid)}`, {
            method: 'POST'
        })

        if (response.status === 200)
            window.location = window.location
        else
            console.log(response)
    }

    async function startDevice(deviceid){
        if (!confirm('Are you sure you want to start this device?'))
            return

        const response = await fetch(`/device/start/${encodeURIComponent(deviceid)}`, {
            method: 'POST'
        })

        if (response.status === 200)
            window.location = window.location
        else
            console.log(response)
    }

    async function restartDevice(deviceid){
        if (!confirm('Are you sure you want to restart this device?'))
            return

        const response = await fetch(`/device/restart/${encodeURIComponent(deviceid)}`, {
            method: 'POST'
        })

        if (response.status === 200)
            window.location = window.location
        else
            console.log(response)
    }

    // bind stop
    const stopButtons = document.querySelectorAll('[data-raction="stop"]')
    for(let stopButton of stopButtons){
        ((stopButton)=>{
            stopButton.addEventListener('click', async event => {
                await stopDevice(stopButton.getAttribute('data-deviceid'))
            })
        })(stopButton)
    }

    // bind start
    const startButtons = document.querySelectorAll('[data-raction="start"]')
    for(let startButton of startButtons){
        ((startButton)=>{
            startButton.addEventListener('click', async event => {
                await startDevice(startButton.getAttribute('data-deviceid'))
            })
        })(startButton)
    }

    // bind restart
    const restartButtons = document.querySelectorAll('[data-raction="restart"]')
    for(let restartButton of restartButtons){
        ((restartButton)=>{
            restartButton.addEventListener('click', async event => {
                await restartDevice(restartButton.getAttribute('data-deviceid'))
            })
        })(restartButton)
    }
})()
