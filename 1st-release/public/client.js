import createKeyboardListener from './keybordListener.js'
import createGame from './game.js'
import renderScreen from './renderScreen.js'







//instancia do jogo
const game = createGame()
const keyboardListener = createKeyboardListener(document)
keyboardListener.subscribe(game.movePlayer)

const socket = io()

const scorePlayer = document.getElementById("score");
setInterval(()=>{
    // console.log(scorePlayer)
    score.textContent = game.state.players[socket.id].score
},500)



socket.on('connect',()=>{
    const playerId = socket.id
    // console.log('player connected on Client with id:',playerId)

    const screen = document.getElementById("screen");
    

    renderScreen(screen, game, requestAnimationFrame, playerId)
})

socket.on("setup",(state)=>{
    const playerId = socket.id
    game.setState(state)
    keyboardListener.registerPlayerId(playerId)
    // keyboardListener.subscribe(game.movePlayer)
    keyboardListener.subscribe((command)=>{
        socket.emit('move-player', command)
    })
})


socket.on('add-player',(command)=>{
    // console.log(`< Receiveing ${command.type}`)
    game.addPlayer(command)

})

socket.on('remove-player',(command)=>{
    // console.log(`< Receiveing ${command.type} -> ${command.playerId}`)
    game.removePlayer(command)

})

socket.on('move-player',(command)=>{
    // console.log(`< Receiveing ${command.type} -> ${command.playerId}`)
    const playerId = socket.id
    // let currentScore = game.state.players[playerId].score

    if(playerId !== command.playerId){
        game.movePlayer(command)
        
    }

})


socket.on('add-fruit',(command)=>{
    // console.log(`< Receiveing ${command.type} -> ${command.playerId}`)
    game.addFruit(command)

})


