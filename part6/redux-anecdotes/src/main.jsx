import ReactDOM from 'react-dom/client'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import App from './App'

import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'

import { createAnecdote } from './reducers/anecdoteReducer'
import { filterChange } from './reducers/filterReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

// const store = configureStore({
//   reducer: {
//     anecdotes: anecdoteReducer,
//     filter: filterReducer
//   }
// })

console.log('from main.jsx, store state ', store.getState())

// store.subscribe(() => console.log(store.getState()))
// store.dispatch(filterChange('d'))
// store.dispatch(createAnecdote('combineReducers forms one reducer from many simple reducers'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    {/*<div />*/}
  </Provider>
)
