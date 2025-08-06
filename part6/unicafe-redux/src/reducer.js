const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      console.log("in good´")
      return {
        good: state.good+1,
        ok: state.ok,
        bad: state.bad
      }
    case 'OK':
      return {
        good: state.good,
        ok: state.ok+1,
        bad: state.bad
      }
    case 'BAD':
      return {
        good: state.good,
        ok: state.ok,
        bad: state.bad+1
      }
    case 'RESET':
      return initialState
    default: return state
  }
  
}

export default counterReducer
