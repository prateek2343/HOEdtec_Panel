import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { handleOtp } from '../pages/auth/common/store'

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
})

instance.interceptors.request.use(async (request) => {
    const ott = JSON.parse(localStorage.getItem('ott'))
    if (ott) {
        request.headers.ott = ott
        request.headers.otp = request.data.otp
    }
    return request
})

const AxiosInterceptor = ({ children }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const resInterceptor = (response) => {
            localStorage.setItem('at', JSON.stringify(response.data.at))
            localStorage.setItem('rt', JSON.stringify(response.data.rt))
            if (response?.data?.admin === undefined) {
            } else {
                localStorage.setItem('Fullname', response.data.admin.fullName)
                localStorage.setItem('adminId', response.data.admin.id)
            }
            return response
        }

        const errInterceptor = (error) => {
            if (error.response.status === 401) {
                const ottToken = error.response.headers['ott']
                if (ottToken) {
                    // Dispatch an action or perform some action with the token
                    localStorage.setItem('ott', JSON.stringify(ottToken))
                    dispatch(handleOtp(true))
                }
            }

            return Promise.reject(error)
        }

        const interceptor = instance.interceptors.response.use(
            resInterceptor,
            errInterceptor
        )

        return () => instance.interceptors.response.eject(interceptor)
    }, [dispatch])

    return children
}

export default instance
export { AxiosInterceptor }
