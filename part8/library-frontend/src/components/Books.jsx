import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS, ALL_BOOKS2 } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const result = useQuery(ALL_BOOKS
  // , {
  //   // variables: { genre },
  //   pollInterval: 2000
  // }
  )

  if (!props.show) {
    return null
  }

  if (result.loading || result.data === undefined)  {
    return <div>loading...</div>
  }

  const genres = result.data.allBooks.map(b => b.genres)
  console.log('here is genre ', genre)
  return (
    <div>
      {/*<p>{`here are genres ${genres}`}</p>
      <p>{`here is genre ${genre}`}</p>
      <p>{`and here are books filtered by genre ${result.data.allBooks.filter(b => b.genres.includes(genre))}`}</p>
      <p>{`and here are books filtered by genre ${result.data.allBooks.map(b => b.genres.includes(genre))}`}</p>
      <p>{`and here are book genres ${result.data.allBooks.map(b => b.genres)}`}</p>*/}
      {genres.map((g,i) => (
        <button key={i} onClick={() => setGenre(g[0])}>{g}</button>
      ))}
      <button onClick={() => setGenre('')}>reset genre</button>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks
            .filter(b =>
              genre === ''
              ? b
              : b.genres.includes(genre)
            )
            .map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
                {/*<td>{`${b.genres} ___ delete this col`}</td>*/}
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
