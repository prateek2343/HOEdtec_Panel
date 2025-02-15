import React, { useEffect, useState } from 'react'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { handleLogin } from './store'
import instance from '../../../api/axiosInterceptor'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

const schema = yup
    .object({
        username: yup
            .string()
            .email('Invalid email')
            .required('Email is Required'),
        password: yup.string().required('Password is Required'),
    })
    .required()

const LoginForm = () => {
    const dispatch = useDispatch()
    const [isLoading, setisLoading] = useState(false)
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

    const onSubmit = async (data) => {
        try {
            setisLoading(true)
            const res = await instance.post(`/auth/admin/login`, data)
            if (res.data) {
                setisLoading(false)
                const data = {
                    isAuth: true,
                    data: res.data,
                }
                dispatch(handleLogin(data))
            }
        } catch (error) {
            setisLoading(false)
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

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                <Textinput
                    name="username"
                    label="email"
                    type="email"
                    onChange={(e) => {
                        handleInputChange(e)
                    }}
                    register={register}
                    error={errors.username}
                    className="h-[48px]"
                    placeholder="Enter Your Registered Email"
                />
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
                    placeholder="Enter Password"
                />
                <div className="flex justify-end">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
                    >
                        Forgot Password?{' '}
                    </Link>
                </div>
                {isLoading ? (
                    <Button
                        text="sign in"
                        className="btn btn-dark block w-full"
                        isLoading
                    />
                ) : (
                    <button type='submit' className="btn btn-dark block w-full text-center">
                        Sign in
                    </button>
                )}
            </form>
        </>
    )
}

export default LoginForm
