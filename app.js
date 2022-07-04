const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const {v4 : roomId} = require('uuid')

app.use(express.static('public'))
app.set('view engine' , 'ejs')

app.get('/' , (req , res) => {
    res.redirect(`/${roomId()}`)
})

app.get('/:room' , (req , res) => {
    res.render('room' , { roomId : req.params.room } )
})


io.on('connection' , socket => {
    socket.on('join-room' , (RoomId , userid) => {
        socket.join(RoomId)
        socket.broadcast.to(RoomId).emit('user-connected' , userid)
        
        socket.on('disconnect' , () => {
            socket.broadcast.to(RoomId).emit('user-disconnected' , userid)
        })
    })

})

server.listen(5000 , console.log('server is listennig on port 5000 '))