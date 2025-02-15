import { useEffect, useRef, useState } from 'react'
import instance from '../../../api/axiosInterceptor'
import './otpstyle.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { handleLogin, handleOtp } from './store'
import { toast } from 'react-toastify'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@/components/ui/Button'

const RestPasswordOtpInput = ({
    length = 6,
    formData,
    onOtpSubmit = () => { },
}) => {
    const [otp, setOtp] = useState(new Array(length).fill(''))
    const inputRefs = useRef([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const schema = yup
        .object({
            password: yup.string().required('Password is Required'),
        })
        .required()
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    })

    const handleInputChange = (e) => {
        setValue(e.target.name, e.target.value)
    }

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [])

    const [isLoading, setisLoading] = useState(false)

    const handleChange = (index, e) => {
        const value = e.target.value
        if (isNaN(value)) return

        const newOtp = [...otp]
        // allow only one input
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        // submit trigger
        const combinedOtp = newOtp.join('')
        if (combinedOtp.length === length) onOtpSubmit(combinedOtp)

        // Move to next input if current field is filled
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1)

        // optional
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf('')].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (
            e.key === 'Backspace' &&
            !otp[index] &&
            index > 0 &&
            inputRefs.current[index - 1]
        ) {
            // Move focus to the previous input field on backspace
            inputRefs.current[index - 1].focus()
        }
        if (e.key === 'Enter' && index === length - 1) {
            // If Enter is pressed on the last input field, trigger validation and submission
            handleOTPValidate()
        }
    }

    const handleOTPValidate = async (data) => {
        // Check if OTP is fully filled
        setisLoading(true)
        if (otp.includes('')) {
            toast.error('Please fill all OTP fields.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            setisLoading(false)
            return
        }
        if (!data) {
            toast.error('Please fill the Password.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            setisLoading(false)
            return
        }
        try {
            let temp = otp[0]
            otp.map((el, i) => {
                if (i > 0) {
                    temp += el
                }
            })
            const res = await instance.post(`/auth/admin/password/reset`, {
                otp: temp,
                userName: formData?.userName,
                password: data?.password,
            })
            if (res.status == 200) {
                setisLoading(false)
                toast.success('Password Changed Successfully.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
                dispatch(handleOtp(false))
                navigate('/')
                return
            }
        } catch (error) {
            setisLoading(false)
            const message = error.response.data.message
            if (message == 'Invalid or expired OTT') {
                toast.error('OTP is incorrect or expired.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            }
        }
    }

    return (
        <>
            <div className="otpstructure">
                {otp.map((value, index) => {
                    return (
                        <input
                            key={index}
                            type="text"
                            ref={(input) => (inputRefs.current[index] = input)}
                            value={value}
                            onChange={(e) => handleChange(index, e)}
                            onClick={() => handleClick(index)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="otpInput"
                        />
                    )
                })}
            </div>
            <form
                onSubmit={handleSubmit(handleOTPValidate)}
                className="space-y-4 mt-5"
            >
                <Textinput
                    name="password"
                    label="password"
                    type="password"
                    register={register}
                    onChange={(e) => {
                        handleInputChange(e)
                    }}
                    error={errors.password}
                    className="h-[48px]"
                    placeholder="Enter New Password"
                />
                <div className="flex justify-center">
                    {isLoading ? (
                        <Button
                            text="Submit"
                            className="btn btn-primary block text-center"
                            isLoading
                        />
                    ) : (
                        <button type='submit' className="btn btn-primary block text-center">
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </>
    )
}
export default RestPasswordOtpInput
