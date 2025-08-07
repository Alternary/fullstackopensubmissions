import { useSelector, useDispatch } from 'react-redux'
import anecdoteReducer, { createAnecdote, updateAnecdoteVotes } from '../reducers/anecdoteReducer'
import notificationReducer, { setNotification, removeNotification, setNotificationTimeout } from '../reducers/notificationReducer'
import Filter from './Filter'
import anecdoteService from '../services/anecdotes'

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filteredAnecdotes =
    useSelector(({ filter, anecdotes, notification }) => {
      if (filter === 'ALL') {
        return anecdotes
      }
      return anecdotes
        .filter(a => a.content.includes(filter))
    })

  const handleVote = async (anecdote) => {
    await anecdoteService.updateVotes(anecdote.id)
    // dispatch(vote(anecdote.id))
    dispatch(updateAnecdoteVotes(anecdote.id))
    // dispatch(setNotification(`you voted '${anecdote.content}'`))
    // setTimeout(() => dispatch(removeNotification()),5000)
    dispatch(setNotificationTimeout(`you voted '${anecdote.content}'`,5))
  }
  console.log('in AnecdoteList, here are filteredAnecdotes ', filteredAnecdotes.filter(a => a.id !== undefined))

  return (
    <>
      <Filter />
      {[...filteredAnecdotes].sort((a1,a2) => a2.votes - a1.votes)
        .map(anecdote =>
          <Anecdote key={anecdote.id} anecdote={anecdote} handleVote={handleVote} />
      )}
    </>
  )
}

export default AnecdoteList
