import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialIsAuth = () => {
    const item = window.localStorage.getItem('isAuth')
    return item ? JSON.parse(item) : false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        users: [],
        resetToken: '',
        openOTPScreen: false,
        isAuth: initialIsAuth(),
    },

    reducers: {
        handleOtp: (state, action) => {
            state.openOTPScreen = action.payload
        },
        handleLogin: (state, action) => {
            const { isAuth, data } = action.payload
            state.isAuth = isAuth
            // save isAuth in local storage
            window.localStorage.setItem('isAuth', JSON.stringify(state.isAuth))
            window.localStorage.setItem(
                'accessToken',
                JSON.stringify(data.accessToken)
            )
            window.localStorage.setItem(
                'refreshToken',
                JSON.stringify(data.refreshToken)
            )
            toast.success('User logged in successfully', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
        },
        handleLogout: (state, action) => {
            state.isAuth = action.payload
            window.localStorage.removeItem('accessToken')
            window.localStorage.removeItem('refreshToken')
            window.localStorage.removeItem('isAuth')
            state.openOTPScreen = false
            toast.success('User logged out successfully', {
                position: 'top-right',
            })
        },
        handleToken: (state, action) => {
            state.resetToken = action.payload
            // remove isAuth from local storage
            console.log(action.payload)
        },
    },
})

export const { handleLogin, handleLogout, handleToken, handleOtp } =
    authSlice.actions
export default authSlice.reducer
