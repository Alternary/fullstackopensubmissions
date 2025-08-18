import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const updateAuthorBirthYear = (event) => {
    event.preventDefault()
    console.log('updating')
    editAuthor({
      variables: { name: name, birthYear: Number(birthYear) }
    })
  }
  // console.log('here are authors ', result.data.allAuthors)
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a,i) => (
            <tr key={i/*a.name*/}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={updateAuthorBirthYear}>
        <select
          onChange={({ target }) => setName(target.value)}
        >
          {result.data.allAuthors.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </select>
        <div>born
          <input
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
