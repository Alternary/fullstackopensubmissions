import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      // .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountry({ data: response.data, found: true })
        console.log('here is some info ', response.data)
        // console.log('some info ', country.data.name, country.data.capital, country.data.population, country.data.flag)
      })
      .catch(error => {
        setCountry({ found: false })
      })
  }, [name])

  return country
}

const Country = ({ country }) => {
  console.log('here is country ', country)

  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }
  // console.log('here is country name ', country.data.name)

  //I had to modify these
  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital[0]} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
