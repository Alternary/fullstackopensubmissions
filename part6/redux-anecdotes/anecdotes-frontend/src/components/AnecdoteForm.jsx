import { useDispatch, useSelector } from 'react-redux'
import  anecdoteReducer, { createAnecdote, vote } from '../reducers/anecdoteReducer'
import  notificationReducer, { setNotification, removeNotification, setNotificationTimeout } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.input.value
    event.target.input.value = ''
    // dispatch(createAnecdote(content)) //this duplicate creation was screwing things up, I need either this or the other dispatch
    // dispatch(setNotification(`you created ${content}`))
    // setTimeout(() => dispatch(removeNotification()), 5000)
    dispatch(setNotificationTimeout(`you created ${content}`, 5))
    const newAnecdote = await anecdoteService.createNew(content)
    // dispatch(createAnecdote(newAnecdote))
    dispatch(createAnecdote(content))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='input' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
