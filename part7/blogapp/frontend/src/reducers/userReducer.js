import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import storage from '../services/storage'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    // initializeUser(state, action) {
    //   storage.loadUser()
    //   if (user) {
    //     return user
    //   }
    //   return null
    // },
    setUser(state, action) {
      return action.payload
    },
    // logoutUser(state, action) {
    //   storage.removeUser()
    //   return null
    // },
    // loginUser(state, action) {
    //   const credentials = action.payload
    //   loginService
    //     .login(credentials)
    //     .then(response => {
    //       const user = response.data
    //       storage.saveUser(user)
    //       return user
    //     })
    //     .catch(error =>)
    // }
  }
})

export const { /* initializeUser,  */setUser/* , logoutUser */ } = userSlice.actions

export default userSlice.reducer
