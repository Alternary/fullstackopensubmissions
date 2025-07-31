import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Notification from './components/Notification.jsx'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [notification, setNotification] = useState(['Notification area'])
  // console.log(notification)

  useEffect(() => {
    // console.log('effecting')
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = event => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      updatePerson()
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification(
            [`Added ${newName}`]
          )
          setTimeout(() => {
            setNotification(["_"])
          }, 5000)
        })
        .catch(error => {
          console.log("error when adding new person: ", JSON.stringify(error.response.data))
          setNotification(
            [`Person validation failed: ${JSON.stringify(error.response.data)}`,'red']
          )
          setTimeout(() => {
            setNotification(["_"])
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    console.log('deleting person ' + name)
    const personName = persons.filter(person => person.id === id)[0].name
    if (window.confirm("Delete " + personName + "?")) {
      setNotification(
        [`Deleted ${personName}`,'green']
        )
      setTimeout(() => {
        setNotification(["_"])
      }, 5000)
      personService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(
            person => person.id !== id
            ))
        })
    }
    else {console.log('didn\'t delete person')}
  }

  const updatePerson = () => {
   if (window.confirm(
     newName + " is already added to phonebook, replace the old number with a new one?")) {
      const updatedPerson = {
        name: newName,
        number: newNumber
      }
      const oldPerson = persons.filter(
        person => person.name === newName
        )[0]
      personService
        .update(oldPerson.id, updatedPerson)
        .then(response => {
          setPersons(persons.filter(
            person => person.id !== oldPerson.id
            )
            .concat(updatedPerson)
          )
          setNotification(
            [`Changed the number of ${newName}`]
            )
          setTimeout(() => {
            setNotification(["_"])
          }, 5000)
        })
        .catch(error => {
          setPersons(persons.filter(
            person => person.id !== oldPerson.id
          ))
          console.log('errored')
          setNotification(
            [`Information of ${newName} has already been removed from server`,'red']
            )
          setTimeout(() => {
            setNotification(["_"])
          }, 5000)

        })
    }
  }

  const handlePersonChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const personsToShow = persons.filter(
    person => person.name.includes(newSearch)
  )

  const handleSearchChange = event => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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
      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
