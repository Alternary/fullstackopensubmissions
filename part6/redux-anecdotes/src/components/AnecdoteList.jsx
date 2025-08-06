import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import Filter from './Filter'

const AnecdoteList = () => {
  const filteredAnecdotes = useSelector(({ filter, anecdotes }) => {
    if ( filter === 'ALL' ) {
      return anecdotes
    }
    return anecdotes
        .filter(a => a.content.includes(filter))
  })
  console.log('here is filtered anecdotes ', filteredAnecdotes)
  const dispatch = useDispatch()

  return (
    <>
      <Filter />
      {filteredAnecdotes.sort((a1,a2) => a2.votes - a1.votes)
        .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList
