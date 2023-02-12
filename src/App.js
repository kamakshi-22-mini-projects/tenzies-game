import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Die } from './components/Die';
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import useWindowSize from "@rooks/use-window-size"

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)

  // check if all dice are held and have the same value
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      console.log("You won!")
    }
  }, [dice])

  // generate object with value,isHeld and id properties and push to newDice array
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  // generate array of 10 new dice    
  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  // roll dice function to generate new dice values
  function rollDice() {
    // if tenzies is false, generate new dice
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die : generateNewDie()
      }))
    } // if tenzies is true, generate new game
    else {
      setTenzies(false)
      setDice(allNewDice())
    }
  }

  // hold dice function to toggle isHeld property
  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
  }

  // generate die elements from dice array
  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  const { innerWidth, innerHeight } = useWindowSize()
  return (

    <main>
      {/* render confetti if tenzies is true and game is over */}
      {tenzies &&
        <Confetti
          width={innerWidth}
          height={innerHeight} />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  )
}
