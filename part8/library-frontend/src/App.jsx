import { useState } from "react"
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { ALL_BOOKS, ALL_AUTHORS, ALL_BOOKS2, MY_FAVORITEGENRE, BOOK_ADDED } from './queries'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // const [newBookAlerter, setNewBookAlerter] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)
      window.alert(`book added with data ${JSON.stringify(data)}`)
      const addedBook = data.data.bookAdded
      // setNewBookAlerter(null)
      // client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      //   return {
      //     allBooks: allBooks.concat(addedBook),
      //   }
      // })
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  if (!token && false) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token !== null
          && <button onClick={() => setPage("add")}>
            add book
          </button>}
        {token !== null
          && <button onClick={() => setPage("recommended")}>
            recommended
          </button>}
        {token === null
          && <button onClick={() => setPage("login")}>login</button>}
        {token !== null
          && <button onClick={() => {setPage("login"); logout}}>logout</button>}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} /* newBookAlerter={newBookAlerter} */ />

      <NewBook show={page === "add"} />

      <Recommended show={page === "recommended"} />

      {<Login show={page === "login"} errorMessage={errorMessage} setToken={setToken} setError={notify} />}
    </div>
  )
}

const Recommended = (props) => {
  const bookResult = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })
  const userResult = useQuery(MY_FAVORITEGENRE, {
    pollInterval: 2000
  })

  if (!props.show) {
    return null
  }

  if (bookResult.loading || bookResult.data === undefined || userResult.loading || userResult.data === undefined) {
    return <div>loading...</div>
  }

  const favoriteGenre = userResult.data.me.favoriteGenre

  return (
    <>
      <h1>recommendations</h1>
      <p>{`books in your favorite genre ${favoriteGenre}`}</p>
      <table>
        <tbody><tr>
          <td></td>
          <td><b>author</b></td>
          <td><b>published</b></td>
        </tr></tbody>
        {bookResult.data.allBooks
          .filter(b => {
            return b.genres.includes(favoriteGenre)
          })
          .map((b,i) => (
            <tbody key={i}><tr>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr></tbody>
          ))
        }
      </table>
    </>
  )
}

const Login = (props) => {
  if (!props.show) {
    return null
  }
  return (
    <div>
      <Notify errorMessage={props.errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={props.setToken}
          setError={props.setError}
        />
    </div>
  )
}

export default App;
