(()=>{

    async function stopDevice(deviceid){

    }

    async function startDevice(deviceid){
        
    }

    async function restartDevice(deviceid){
        
    }

    // stop
    const stopButtons = document.querySelectorAll('[data-raction="stop"]')
    for(let stopButton of stopButtons){
        ((stopButton)=>{
            stopButton.addEventListener('click', async event => {
                alert('stop ' + stopButton.getAttribute('data-deviceid'))
                await stopDevice(stopButton.getAttribute('data-deviceid'))
            })
        })(stopButton)
    }

    // start
    const startButtons = document.querySelectorAll('[data-raction="start"]')
    for(let startButton of startButtons){
        ((startButton)=>{
            startButton.addEventListener('click', async event => {
                alert('start ' + startButton.getAttribute('data-deviceid'))
                await startDevice(startButton.getAttribute('data-deviceid'))
            })
        })(startButton)
    }

    // restart
    const restartButtons = document.querySelectorAll('[data-raction="restart"]')
    for(let restartButton of restartButtons){
        ((restartButton)=>{
            restartButton.addEventListener('click', async event => {
                alert('restart ' + restartButton.getAttribute('data-deviceid'))
                await restartDevice(restartButton.getAttribute('data-deviceid'))
            })
        })(restartButton)
    }
})()
