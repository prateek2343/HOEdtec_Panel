import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usePostRestaurantMutation } from '../../../api/api'

const AddRestaurant = () => {
    const navigate = useNavigate()
    const [createRestaurant, { error: restaurantPostError, isLoading: loading }] = usePostRestaurantMutation()
    const schema = yup
        .object({
            name: yup.string().required('Name is required'),
            contactperson_name: yup
                .string()
                .required('Contact Person Name is Required'),
            contactperson_email: yup
                .string()
                .required('Enter Contact Person Email is Required'),
            contactperson_phone: yup
                .string()
                .required('Enter Contact Person Phone is Required'),
        })
        .required()

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const handleChange = (e) => {
        setValue(e.target.name, e.target.value || '')
    }

    const onSubmit = async (data) => {
        try {
            const response = await createRestaurant({ data })
            if (response?.data) {
                toast.success('Restaurant Created successfully', {
                    position: 'top-right',
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
                navigate('/restaurants')
            }
            if (restaurantPostError || response?.error) {
                console.log('Failed to create Restaurant', response?.error)
                if (
                    response?.error?.status === 400 &&
                    response?.error?.data?.message ===
                    'Restaurant already exist'
                ) {
                    toast.error('Restaurant already exists', {
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
                }
                toast.error('Failed to create Restaurant', {
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
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleReset = () => {
        reset()
    }

    return (
        <div>
            <Card title="Add new Restaurant">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid lg:grid-cols-2 gap-5">
                        <Textinput
                            label="Name *"
                            name="name"
                            onChange={handleChange}
                            error={errors.name}
                            register={register}
                            type="text"
                            placeholder="Enter Restaurant Name"
                        />
                        <Textinput
                            label="Contact Person Name *"
                            name="contactperson_name"
                            onChange={handleChange}
                            error={errors.contactperson_name}
                            register={register}
                            type="text"
                            placeholder="Enter Contact Person Name"
                        />
                        <Textinput
                            label="Enter Contact Person Email *"
                            name="contactperson_email"
                            onChange={handleChange}
                            error={errors.contactperson_email}
                            register={register}
                            type="text"
                            placeholder="Enter Contact Person Email"
                        />
                        <Textinput
                            label="Enter Contact Person Phone *"
                            name="contactperson_phone"
                            onChange={handleChange}
                            error={errors.contactperson_phone}
                            register={register}
                            type="text"
                            placeholder="Enter Contact Person Phone"
                        />
                        <Textinput
                            label="Enter Merchant ID"
                            name="merchant_id"
                            onChange={handleChange}
                            error={errors.merchant_id}
                            register={register}
                            type="text"
                            placeholder="Enter Merchant ID (Optional)"
                        />
                    </div>

                    <div className="ltr:text-right rtl:text-left mt-5">
                        <button className="btn btn-dark mr-5" type="button" onClick={() => navigate('/restaurants')} >
                            Cancel
                        </button>
                        <button className="btn btn-dark text-center mr-5" type="button" onClick={handleReset} >
                            Reset
                        </button>
                        {loading ? (
                            <Button className="btn btn-primary text-center" isLoading />
                        ) : (
                            <button type="submit" className="btn btn-primary text-center">
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default AddRestaurant