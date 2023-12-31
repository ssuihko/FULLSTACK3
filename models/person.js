const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// const uniqueValidator = require('mongoose-unique-validator')

// const url = process.env.MONGODB_URI

// mongoose
const password = process.env.PASSWORD

const url =
`mongodb+srv://fullstack:${password}@cluster0.kpz97og.mongodb.net/?retryWrites=true&w=majority`

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
  }
})

// personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)