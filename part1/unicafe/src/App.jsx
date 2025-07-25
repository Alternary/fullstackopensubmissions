import { useState } from 'react'

const cl = (...args) => console.log(...args)

const Button = (props) =>
  <button onClick={props.onClick}>{props.text}</button>

const StatisticLine = (props) =>
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>

const Statistics = (props) => {
  const { good, neutral, bad, all, average, positive } = props
  if (all == 0) {
    return <div>No feedback given</div>
  }
  else {
    return (
      <table>
        <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive+" %"} />
      </tbody>
      </table>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(100/3)

  const setVals = (val,setVal,which) => () => {
    const newVal = val+1
    const oldGood = good
    const oldBad = bad
    const newAll = all+1

    cl("setting vals")
    cl(positive)

    setVal(newVal)
    setAll(newAll)
    if (which == "good") {
      setPositive(100*(oldGood+1)/newAll)
      setAverage((oldGood+1-oldBad)/newAll)
      cl("hey")
    }
    else {
      cl("yo")
      cl(positive)
      cl(all)
      cl(newAll)
      if (which == "bad") {
        setAverage((oldGood-(oldBad+1))/newAll)
      }
      setPositive(100*(oldGood)/newAll)
    }
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={"good"} onClick={setVals(good,setGood,"good")} />
      <Button text={"neutral"} onClick={setVals(neutral,setNeutral,"neutral")} />
      <Button text={"bad"} onClick={setVals(bad,setBad,"bad")} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App
