const filterReducer = (state = 'ALL', action) => {
  console.log('in filterReducer, ACTION: ', action)
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterChange = (val) => {
  return {
    type: 'SET_FILTER',
    payload: val
  }
}

export default filterReducer
