import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  console.log('in createNew, here is response.data ', response.data)
  return response.data
}

const updateVotes = async (id) => {
  // const anecdoteToChange = await axios.get(`${baseUrl}/anecdotes/${id}`)
  const response = await axios.get(baseUrl)
  const anecdoteToChange = response.data.find(a => a.id === id)
  console.log('here is anecdote to change ', anecdoteToChange)
  const updatedAnecdote = {
    ...anecdoteToChange,
    votes: anecdoteToChange.votes+1
  }
  const response2 = await axios.put(`${baseUrl}/${id}`,updatedAnecdote)
  return response2.data
}

export default { getAll, createNew, updateVotes }
