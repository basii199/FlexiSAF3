import { createRoot } from "react-dom/client"
import React, { useEffect } from "react"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

import { Die } from "./components/Die"
import Guide from "./components/Guide"

export function App (){  
  
  const [gameWon, setGameWon] = React.useState(false)

  const [dice, setDice] = React.useState(generateRandom)

  let [currentHold, setCurrentHold] = React.useState("")

  const { width, height} = useWindowSize()

  const refElement = React.useRef(null)

  const holdValue = dice.every(die=>die.isHeld === false)

  const dieElement = dice.map(die => 
    <Die 
      key={die.id}
      id={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      isWrong={die.isWrong}
      hold={hold}
      check={check}
    />)  

  function generateRandom(){
    let array = []
    for (let i=0; i<10; i++){
      array.push({
        value: Math.ceil(Math.random() * 6), 
        isHeld: false,
        isWrong: false,
        id: nanoid()
      })
    }
    return array  
  }  

  function newGame (){
    setGameWon(false)
    setDice(generateRandom)
    setCurrentHold("")
  }

  useEffect(()=>{
    refElement.current.focus()
  }, [gameWon])

  function reRoll (){
    setDice(prev => prev.map((die)=>{
      if (die.isHeld === true){
        return die
      } else {
        return {...die, value: Math.ceil(Math.random() * 6)}
      }
    }))
  }

  function check (value, id){  
    holdValue === true && (currentHold = "")    
    if(currentHold === "" || currentHold === value){
      hold(id)
    } else {
      wrong(id)
    }
    dice.every(die=>die.value === value)&& setGameWon(true)
  }  

  function hold (id){
    setDice(prev =>  prev.map(die=>{
      if(die.id === id){
        setCurrentHold(die.value)
        return {...die, isHeld: !die.isHeld}
      } else {
        return die
      }      
      })
    )    
  }  

  function wrong (id){
    setDice(prev =>  prev.map(die=>{
      if(die.id === id){
        setTimeout(() => {
            setDice(prev=> prev.map(die=>{
              return {...die, isWrong: false}
            }))
        }, 400);

        return {...die, isWrong: true}           
      } else {
        return die
      }      
      })
    )
  }

  return(
    <main className="main">
      <div className="guide"><Guide/></div>


      {gameWon && <Confetti width={width} height={height}/>}
      <div className="die-container">
        {dieElement}
      </div>  

      <button 
        className="roll-button" 
        ref={refElement}
        onClick={gameWon? newGame : reRoll}
      >
        {gameWon? "New Game" : "Roll"}
      </button>
    </main>  
  )
}

const root = createRoot(document.getElementById("root"))

root.render(
  <App />
)

