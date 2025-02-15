import React, { useState } from 'react'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import ResetPassOTP from './ResetPassOTP'
import instance from '../../../api/axiosInterceptor'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'

const schema = yup
    .object({
        username: yup
            .string()
            .email('Invalid email')
            .required('Email is Required'),
    })
    .required()
const ForgotPass = () => {
    const dispatch = useDispatch()
    const { openOTPScreen } = useSelector((state) => state.auth)
    const [formData, setFormData] = useState(null)
    const [isLoading, setisLoading] = useState(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        setisLoading(true)
        try {
            setFormData(data)
            const res = await instance.post(`/auth/admin/password/reset`, data)
            setisLoading(false)
        } catch (error) {
            setisLoading(false)
            const statusCode = error.response.status
            const message = error.response.data.message
            if (message == `Invalid Admin <${data.username}>`) {
                toast.error('Wrong Credentials', {
                    position: 'top-right',
                    autoClose: 2500,
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
            {openOTPScreen ? (
                <ResetPassOTP formData={formData} />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                    <Textinput
                        name="username"
                        label="email"
                        type="email"
                        register={register}
                        error={errors.email}
                        className="h-[48px]"
                        placeholder="Please Enter Your Registed Email"
                    />
                    {isLoading ? (
                        <Button
                            text="sign in"
                            className="btn btn-dark block w-full"
                            isLoading
                        />
                    ) : (
                        <button type='submit' className="btn btn-dark block w-full text-center">
                            Send Verification Code
                        </button>
                    )}
                </form>
            )}
        </>
    )
}

export default ForgotPass
