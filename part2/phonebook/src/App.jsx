import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import axios from 'axios'


const App = () => {
  const [persons, setPersons] = useState([])
  //   { name: 'Arto Hellas', number: '0' }
  //   ,{name:'a',number:'1'},{name:'b',number:'2'}
  // ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
  console.log('effecting')
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = event => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      alert(newName + ' is already added to phonebook')
    }
    else {
      // console.log(event.target)
      const newPerson = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(newPerson))
      // console.log(persons, ' is the persons')
      setNewName('')
      setNewNumber('')
    }
  }

  const handlePersonChange = event => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const personsToShow = persons.filter(
    person => person.name.includes(newSearch)
  )

  const handleSearchChange = event => {
    // console.log(event.target.value)
    setNewSearch(event.target.value)
  }

  return (
    <div>
      {/*<div>debug: {newName}</div>*/}
      <h2>Phonebook</h2>
      <Filter
        search={newSearch}
        onSearchChange={handleSearchChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={handlePersonChange}
        number={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
