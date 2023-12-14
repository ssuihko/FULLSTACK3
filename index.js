const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
app.use(express.static('dist'))

app.use(express.json())
app.use(cors())

morgan.token('body', function (req) { return JSON.stringify(req.body) })
morgan('tiny')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

const generateId = () => {
    // const maxId = notes.length > 0
    //  ? Math.max(...notes.map(n => n.id))
    //  : 0

    const rand = Math.floor(Math.random() * Math.floor(1000))
    return rand
  }

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' + length + ' people ' + '<br>' + new Date() + ' </p>')
  })
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
    let nameArray = persons.map(( { name }) => name)
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    if(nameArray.indexOf(person.name) > -1) {

        return response.status(400).json({
          error: 'name must be unique, do you want to replace the number recorded to this name'
        })
      }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })