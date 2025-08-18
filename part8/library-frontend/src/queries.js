import { gql } from '@apollo/client'

export const MY_FAVORITEGENRE = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const ALL_BOOKS = gql`
  query getAllBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`

export const ALL_BOOKS2 = gql`
  query {
    allBooks  {
      title
      author
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`

//had to include exclamations in the parameters to make it work
export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $birthYear: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $birthYear
    ) {
      name
      born
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
