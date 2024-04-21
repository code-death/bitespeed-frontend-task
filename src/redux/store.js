import {configureStore, createSlice} from '@reduxjs/toolkit'
import users from '../constants/userList.json'

const roomSlice = createSlice({
    name: 'biteSpeed',
    initialState: {
        users: users
    },
    reducers: {
    }
})

export const {

} = roomSlice.actions

const store = configureStore({
    reducer: roomSlice.reducer
})

export default store;
