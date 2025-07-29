import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ countryName, showCountry }) => {
  return (
    <div>
      {countryName + " "}
      <button onClick={() => showCountry(countryName)}>Show</button>
    </div>
  )
}

const CountryFull = ({ country }) => {
  // console.log("in CountryFull, here is country ",country)
  const api_key = import.meta.env.VITE_SOME_KEY
  const [weatherData,setWeatherData] = useState(null)
  //need temperature, icon, and wind speed

  const kelvinToCelsius = kelvin => kelvin-273.15

  useEffect(() => {
    // console.log("useEffect in countryFull log")
    const countryCapital = country.capital[0]
    axios
      .get(`
        https://api.openweathermap.org/data/2.5/weather?q=${countryCapital}&APPID=${api_key}
      `)
      .then(response => {
        // console.log("weather response data is: ", response.data)
        // console.log("country capital is: ", countryCapital)
        setWeatherData(response.data)
        // console.log("weather is ", response.data.weather)
      })
      // .catch(error => {
      //   console.log("error with weather data")
      // })
  }, [])

 return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(
          language => <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} />
      {
        weatherData === null
        ? <p>No weather data</p>
        : <div>
          <h2>Weather in {country.name.common}</h2>
          <p>Temperature {kelvinToCelsius(weatherData.main.temp)} Celsius
          </p>
          <img
            src={`https:openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          />
          <p>Wind {weatherData.wind.speed} m/s</p>
        </div>
      }
    </div>
  )
}

const Countries = ({ countries, showCountry }) => {
  // useEffect(() => {
  //   console.log("useEffect in Countries log")
  // }, [])

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country =>
          <Country 
            key={country.name.common}
            countryName={country.name.common}
            showCountry={showCountry}
          />
        )}
      </div>
    )
  }
  else if (countries.length == 1) {
    const country = countries[0]
    return <CountryFull country={country} />
  }
}

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState({})
  const [country, setCountry] = useState(null)

  useEffect(() => {
    // console.log('effect run, country is now', country)

    // skip if country is not defined
    if (country) {
      // console.log('fetching countries...')
      axios
        .get(`
          https://studies.cs.helsinki.fi/restcountries/api/all
        `)
        .then(response => {
          const matchedCountries = response.data.filter(
            c => c.name.common.toLowerCase().includes(country.toLowerCase())
          )
          setCountries(matchedCountries)
          // console.log("matched countries are ", matchedCountries)
        })
    }
  }, [country])

  const showCountry = name => {
    setCountry(name)
    // const newCountries = countries.filter(country => country.name.common === name)[0]
    setCountries(countries.filter(country => country.name.common === name))
    // console.log("showing country")
    // console.log("countries is:",newCountries)
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    // console.log("here is event and value ",event,value)
    event.preventDefault()
    setCountry(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries <input value={value} onChange={handleChange} />
      </form>
      <Countries countries={countries} showCountry={showCountry} />
    </div>
  )
}

export default App
