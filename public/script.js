const socket = io('/')
const peer = new Peer(undefined , {
    host: '/',
    port: '5001'
})
const videoGrid = document.getElementById('video-grid')
const myvideo = document.createElement('video')
myvideo.muted = true

const peers = {}

peer.on('open' , id => {
    socket.emit('join-room' , RoomId , id )
})

socket.on('user-disconnected' , userid => {
    if(peers[userid]) peers[userid].close()
})

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : false
}).then((stream) => {
    addVideoStream(myvideo , stream)

    peer.on('call' , call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream' , userVideoStream => {
            addVideoStream(video , userVideoStream)
        })
    })
    socket.on('user-connected' , userid => {
        connectToNewUser(userid , stream)
    })
}).catch(err => console.log(err))




function connectToNewUser (userid , stream){
    const video = document.createElement('video')
    const call = peer.call(userid , stream)
    call.on('stream' , (userVideoStream) => {
        addVideoStream(video , userVideoStream)
    })
    call.on('close' , () => {
        video.remove()
    })

    peers[userid] = call
}

function addVideoStream ( video , stream ){
    video.srcObject = stream
    video.addEventListener('loadedmetadata' , () => {
        video.play()
    })
    videoGrid.append(video)
}