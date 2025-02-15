import React, { useState } from 'react'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@/components/ui/Button'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

const schema = yup
    .object({
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is Required'),
    })
    .required()

const EmailVerify = ({ token, setDisplayPos, setIsConnected }) => {
    const [loading, setLoading] = useState(false)

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const handleInputChange = (e) => {
        setValue(e.target.name, e.target.value)
    }

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/client/verify?email=${data.email}&token=${token}`
            )
            if (response?.status === 200) {
                localStorage.setItem('restaurantName', response?.data?.name)
                setDisplayPos(true)
            }
        } catch (error) {
            if (error?.response?.data?.message === 'Pos already connected') {
                setIsConnected(true)
                return
            }
            toast.error('Invitation Expired', {
                position: 'top-right',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            return
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                    <Textinput
                        name="email"
                        label="Email"
                        type="email"
                        register={register}
                        placeholder="Enter Your Email"
                        error={errors.email} // Corrected error field reference
                        className="h-[48px]"
                        onChange={(e) => {
                            handleInputChange(e)
                        }}
                    />
                    {loading ? (
                        <Button
                            className="btn btn-dark block w-full text-center"
                            isLoading
                        />
                    ) : (
                        <button type="submit" className="btn btn-dark block w-full text-center">
                            Continue
                        </button>
                    )}
                </form>
            </div>
        </>
    )
}

export default EmailVerify
