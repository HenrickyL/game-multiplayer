// design pettern factory
export default function createGame(){
    const state = {
        players:{},
        fruits:{},
        screen:{
            width:20,
            height:20,
        },
        map:null,
        started:false
    }
    const observers = []
    //
    function start(frq){
        if(state.started===false){
            let aux
            state.started = true
            state.map=[]
            for(let j=0;j<state.screen.height;j++){
                aux = []
                for(let i=0;i<state.screen.width;i++){
                    aux.push(0)
                }
                state.map.push(aux)
            }
            console.log(state.map)
        }
        const frequency = frq ? frq : 2000
        setInterval(addFruit,frequency) 
    }
    //
    function subscribe(observerFunction){
        observers.push(observerFunction)
    }
    //
    function notifyAll(command){
        //console.log(`Notifying ${state.observers.length} observers`)
        for(const observerFunction of observers){
            observerFunction(command)
        }
    }




    //
    function setState(newState){
        Object.assign(state,newState)
    }
    //
    function addPlayer(command){
        const playerId = command.id
        const playerX = 'x' in command ? command.x : Math.floor(Math.random() * state.screen.width )
        const playerY = 'y' in command ? command.y : Math.floor(Math.random() * state.screen.height )

        state.players[playerId] ={
            score: 0,
            x : playerX,
            y : playerY
        }
        notifyAll({
            type:'add-player',
            id: playerId,
            x: playerX,
            y: playerY
        })
    }
    //
    function removePlayer(command){
        const playerId = command.id
        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            id:playerId
        })
    }

    //
    function addFruit(command){
        
        const fruitId = command ? command.id :  Math.floor(Math.random()*10000000)
        const fruitX =  command ? command.x :   Math.floor(Math.random() * state.screen.width )
        const fruitY =  command ? command.y :   Math.floor(Math.random() * state.screen.height )
        
        if(state.map[fruitX][fruitY]===0){
            state.fruits[fruitId] = {
                x : fruitX,
                y : fruitY
            }
            state.map[fruitX][fruitY]=1

            notifyAll({
                type:'add-fruit',
                id:fruitId,
                x:fruitX,
                y:fruitY
            })
        }else{
            addFruit(command)
        }
    }
    //
    function removefruit(command){
        const fruitId = command.fruitId
        state.map[state.fruits[fruitId].x][state.fruits[fruitId].y]=0
        delete state.fruits[fruitId]
    }
    //
    function checkFruitcollision(playerId){
            const player = state.players[playerId]
            for(const fruitId in state.fruits){
                // console.log(`Checking ${playerId} and ${fruitId}`  )
                const fruit = state.fruits[fruitId]
                if(player.x===fruit.x && player.y===fruit.y){
                    console.log(`Collision between ${playerId} and ${fruitId}`)
                    removefruit({fruitId})
                    state.players[playerId].score++
                    
                }
            }
            
        
    }
    //
    function movePlayer(command){
        notifyAll(command)
        //console.log(`Moving ${command.playerId} with ${command.keyPress}`)
        
        const acceptsMoves = {
            ArrowUp(player){
                //console.log("Moving player Up")
                if(player.y-1>=0){
                    player.y-=1
                    return
                }
            },
            ArrowDown(player){
                //console.log("Moving player Down")
                if(player.y+1<state.screen.width){
                    player.y+=1
                    return
                }
            },
            ArrowLeft(player){
                //console.log("Moving player Left")
                if(player.x-1>=0){
                    player.x-=1
                    return
                }
            },
            ArrowRight(player){
                //console.log("Moving player Right")
                if(player.x+1< state.screen.height){
                    player.x+=1
                    return
                }
            }
        }
        
        const keyPress = command.keyPress
        const playerId = command.playerId
        const player = state.players[command.playerId]
        const moveFunction = acceptsMoves[keyPress]
        if(player && moveFunction){
            moveFunction(player)
            checkFruitcollision(playerId)            
            
        }
        // console.log('<<',state.players[playerId].score)
        return state.players[playerId].score        
        
    }
    //
    return{
        movePlayer,
        state,
        addPlayer,
        removePlayer,
        addFruit,
        removefruit,
        checkFruitcollision,
        setState,
        subscribe,
        start
    }
}