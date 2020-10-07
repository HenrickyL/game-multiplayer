
// renderizar a tela
export default function renderScreen(screen, game,requestAnimationFrame, currentPlayerId ){
    const context = screen.getContext('2d')
    
    context.clearRect(0, 0, screen.width, screen.height);
    // context.globalAlpha = 0.5;
    //draw fruits
    for(let fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId]
        context.fillStyle='green'   
        context.fillRect(fruit.x,fruit.y,1,1)
    }
    //draw players
    for(let playerId in game.state.players){
        const player = game.state.players[playerId]
        if(playerId === currentPlayerId){
            context.fillStyle= 'yellow'
        }else{
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
         }

        context.fillRect(player.x,player.y,1,1)

    }

    requestAnimationFrame(()=>{
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}
