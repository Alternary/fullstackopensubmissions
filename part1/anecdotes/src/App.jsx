import { useState } from 'react'

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const Button = (props) =>
  <button onClick={props.onClick}>{props.text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] =
    useState(Array(anecdotes.length).fill(0))

  const changeAnecdote = () =>
    setSelected(getRandomInt(0,anecdotes.length))

  const vote = () => {
    const newVotes = [...votes]
    console.log(selected)
    newVotes[selected] += 1
    setVotes(newVotes)
    console.log(newVotes)
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <Button onClick={vote} text="vote" />
      <Button onClick={changeAnecdote} text="next anecdote" />
      <h2>Anecdote with most votes</h2>
      <p>
        {anecdotes[votes.reduce(
          (iMax,x,i,arr) => x > arr[iMax] ? i : iMax ,0
        )]}
      </p>
    {/*<p>{votes}</p>*/}
    </div>
  )
}//

export default App
