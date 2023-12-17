const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.kpz97og.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)



const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', PersonSchema)


var A = []



process.argv.forEach((val) => {
  A.push(val)
})


if (A.length < 4) {

  console.log('phonebook: ')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })

} else {

  const person = new Person({
    name: A[3],
    number: A[4],
  })

  person.save().then(result => {
    console.log('added ' + A[3] + ' number ' + A[4] + ' to phonebook'),
    mongoose.connection.close()
  })
}