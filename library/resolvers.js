const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { v1: uuid } = require('uuid')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = 'HERES_THE_SECRET_KEY'

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    me: (root, args, context) => {
      return context.currentUser
    }, 
    allBooks: async (root, args) => {
      //if no parameters are given
      if(!args.author && !args.genre) return Book.find({}).populate('author', {name: 1, born: 1})
    
      //if only the author is given
      if(!args.genre) return Book.find({ author: args.author }).populate('author', {name: 1, born: 1})

      //if only the genre is given
      if(!args.author) {
        return Book.find({ genres: args.genre }).populate('author', {name: 1, born: 1})
      }

      //if both parameters are given
      return Book.find({ author: args.author, genres: args.genre }).populate('author', {name: 1, born: 1})
    },
    allAuthors: async () => {
      
      const countBooks = async (author) => {
        const book = await Book.find({ author: author })
        return book.length
      }

      const copy = await Author.find({})
      let authors = []
      for (var i = 0; i < copy.length; i++) {
        let author = {...copy[i]._doc, bookCount: await countBooks(copy[i])}
        authors = authors.concat(author)
      }
      return authors
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let book
      try {
        let author
        const foundAuthor = await Author.findOne({ name: args.author })
        if (!foundAuthor) {
          author = new Author({name: args.author, id: uuid()})
          await author.save()
        }
        
        book = new Book({ ...args, author: !foundAuthor ? author : foundAuthor, id: uuid() })
        await book.save()
    } catch(error) {
      throw new UserInputError(error.message, {
        invalidArgs: args
      })
    }

      pubsub.publish('BOOK_ADDED', {addedBook: book})

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      try {
        author.born = args.setBornTo
        await author.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return author
    },
    createUser: (root, args) => {
      const user = new User({username: args.username, favoriteGenre: args.favoriteGenre})

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    addedBook: {
      subscribe: () => {
        return pubsub.asyncIterator(['BOOK_ADDED'])
      }
    }
  }
}

module.exports = resolvers