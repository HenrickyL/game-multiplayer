import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command)=>{
    console.log("> Emitting ", command.type)
    sockets.emit(command.type, command)
})





sockets.on('connection',(socket)=>{
    const playerId = socket.id
    console.log("> Player Connected on Server with id:", playerId)
    
    game.addPlayer({id:playerId})
    
    socket.emit('setup',game.state)

    socket.on('disconnect',()=>{
        game.removePlayer({id:playerId})
        console.log(playerId, ' disconnect from server!')
    })

    socket.on('move-player',(command)=>{
        //sobrescrever para ter certeza que é ele mesmo
        command.playerId=playerId
        command.type = 'move-player'
        game.movePlayer(command)
    })
})







const port = 3000
server.listen(port,()=>{
    console.log('> Server Listening on port: ', port)
})