const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type User {
    username: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String
    id: ID
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filterByGenre = bs => bs.filter(b =>
        args.genre === undefined || args.genre == ''
        ? true
        : b.genres.includes(args.genre)
      )
      const books = await Book.find({}).populate('author')
      if (args.author !== '' && args.author !== undefined && args.author !== null) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          const authorId = author._id.toString()
          const booksFilteredByAuthor = books
            .filter(book => book.author._id.toString() === authorId)
          // throw new GraphQLError(`debugging, here is book author ids ${bookAuthorIds} and here is authorId ${authorId}`)
          return filterByGenre(booksFilteredByAuthor)
        }
        else {//no such author found
          return []
        }
      }
      return filterByGenre(books)
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      //somehow need to get bookCount for author
      //could search all books and attach it
      return authors
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({
          name: args.author,
        })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Creating author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const newBook = new Book({ ...args, author: author })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
      return newBook
    },
    // addBook: async (root, args) => {
    //   authorNames = authors2.map(a => a.name)
    //   if (! authorNames.includes(args.author)) {
    //     newAuthor = { name: args.author, id: uuid() }
    //     authors2 = authors2.concat(newAuthor)
    //   }
    //   const newBook = { ...args, id: uuid() }
    //   books2 = books2.concat(newBook)
    //   return newBook
    // },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (author === null) {
        throw new GraphQLError('no such author', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch(error) {
        throw new GraphQLError('Saving birth year failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo
          }
        })
      }
      return author
    },
    // editAuthor: async (root, args) => {
    //   const oldAuthor = authors2.find(a => a.name === args.name)
    //   if (!oldAuthor) {
    //     return null
    //   }
    //   const updatedAuthor = { ...oldAuthor, born: args.setBornTo }
    //   authors2 = authors2.map(a => a.name === args.name ? updatedAuthor : a)
    //   return updatedAuthor
    // }
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
// startStandaloneServer(server, {
//   listen: { port: 4000 },
// }).then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })
