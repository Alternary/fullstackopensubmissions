const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

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

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

      return newBook
    },
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
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

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
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers
