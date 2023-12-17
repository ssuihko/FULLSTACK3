const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const mongoose = require('mongoose')

require('dotenv').config()

app.use(express.static('dist'))

app.use(express.json())
app.use(cors())

morgan.token('body', function (req) { return JSON.stringify(req.body) })
morgan('tiny')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// mongoose
const password = process.env.PASSWORD

const url =
`mongodb+srv://fullstack:${password}@cluster0.kpz97og.mongodb.net/?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)
mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true  })


// const Person = mongoose.model('Person', PersonSchema)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name ===  'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const Person = require('./models/person')

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1

  }, {
    name: 'Ada Lovelace',
    number: '39-44-534356767',
    id: 4
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234567',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 2
  }

]

var length = persons.length.toString()


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(
    result => {
      res.send('<p>Phonebook has info for ' + result + ' people ' + '<br>' + new Date() + ' </p>')
    }
  )})

app.get('/api/persons', (req, res) => {
  // res.json(persons)
  Person.find({}).then(p => {
    res.json(p)
  })
})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {

  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { runValidators: true, context: 'query' } )
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  let nameArray = persons.map(( { name }) => name)

  const body = request.body

  if (!body.name || !body.number ) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(1000)),
  })

  if(nameArray.indexOf(person.name) > -1) {

    return response.status(400).json({
      error: 'name must be unique, do you want to replace the number recorded to this name'
    })
  }

  persons = persons.concat(person)
  nameArray = nameArray.concat(person.name)

  length = persons.length.toString()

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})