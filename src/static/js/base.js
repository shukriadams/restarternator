(()=>{

    async function logout(){
        if (!confirm('Are you sure you want to logout?'))
            return

        const response = await fetch(`/session`, {
            method: 'DELETE'
        })

        window.location = window.location
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

    async function pollStatus(parentNode){
            
            getDeviceStatus = async (parentNode)=>{
                const deviceid = parentNode.getAttribute('data-pollid'),
                    poweredOnNode = parentNode.querySelector('.device-poweredOnContent'),
                    poweredOffNode = parentNode.querySelector('.device-poweredOffContent'),
                    unavailableNode = parentNode.querySelector('.device-unavailableContent'),
                    gettingStatus = parentNode.querySelector('.device-gettingStatus'),
                    statePending = parentNode.querySelector('.device-gettingStatus')
    
                const response = await fetch(`/device/status/${encodeURIComponent(deviceid)}`),
                    statusReponse = await response.json()
        
                gettingStatus.classList.remove('--visible')
        
                poweredOnNode.classList.remove('--visible')
                poweredOffNode.classList.remove('--visible')
                unavailableNode.classList.remove('--visible')
                statePending.classList.remove('--visible')

                if (statusReponse.result.status === 'poweredOn')
                    poweredOnNode.classList.add('--visible')
                else if (statusReponse.result.status === 'poweredOff')
                    poweredOffNode.classList.add('--visible')
                else if (statusReponse.result.status === 'statePending')
                    statePending.classList.add('--visible')
                else 
                    unavailableNode.classList.add('--visible')
            }
        
        setInterval(async()=>{
            await getDeviceStatus(parentNode)
        }, 5000)

        await getDeviceStatus(parentNode)
    }

    // bind logout
    const btnLogout = document.querySelector('.logout')
    if (btnLogout){
        btnLogout.addEventListener('click', async event => {
            await logout()
        })
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

    // bind polling
    const polls = document.querySelectorAll('[data-pollid]')
    for(let poll of polls){
        (async(poll)=>{
            await pollStatus(poll)
        })(poll)
    }

})()
