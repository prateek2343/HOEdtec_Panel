import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetSingleRestaurantQuery, useUpdateRestuarantMutation } from '@/api/api'
import SkeletionTable from '@/components/skeleton/Table'
import Button from '@/components/ui/Button'
import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

function EditRestaurant() {
    const params = useParams()
    const id = params.id
    let navigate = useNavigate()

    //  RTK Query hook to fetch restaurant data
    const { data: restaurant, isLoading, error: isError, refetch: refetch } = useGetSingleRestaurantQuery({ id })
    const [updateRestaurant, { error: updateError, isLoading: updateLoading }] = useUpdateRestuarantMutation()

    const schema = yup
        .object({
            name: yup.string().required('name is Required'),
            contactperson_name: yup.string().required('contact person name is Required'),
            contactperson_email: yup.string().email('invalid email').required('contact person email is Required'),
            contactperson_phone: yup.string().required('contact person phone is Required'),
        })
        .required()

    useEffect(() => {
        if (isError?.status == 404) {
            toast.error('No Data Found', {
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
    }, [isError])

    const AddExistingdata = () => {
        if (restaurant) {
            setValue('name', restaurant.name || '')
            setValue('contactperson_name', restaurant.contactperson_name || '')
            setValue('contactperson_email', restaurant.contactperson_email || '')
            setValue('contactperson_phone', restaurant.contactperson_phone || '')
            setValue('merchant_id', restaurant.merchant_id || '')
        }
    }

    useEffect(() => {
        AddExistingdata()
    }, [restaurant])

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
        console.log(data);
        try {
            const response = await updateRestaurant({ id, data })
            if (response?.data) {
                toast.success('Restaurant updated successfully', {
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
            if (updateError || response?.error) {
                console.log('Failed to update Restaurant', updateError || response?.error)
                toast.error('Failed to update Restaurant', {
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
        AddExistingdata()
    }


    return (
        <>
            {
                isLoading ? (<SkeletionTable />) : (
                    <Card title="Edit Restaurant">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid lg:grid-cols-2 gap-5">
                                <Textinput
                                    label="Name *"
                                    name="name"
                                    onChange={handleChange}
                                    error={errors.name}
                                    register={register}
                                    type="text"
                                    placeholder="Restaurant Name"
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
                                    label="Contact Person Email *"
                                    name="contactperson_email"
                                    onChange={handleChange}
                                    error={errors.contactperson_email}
                                    register={register}
                                    type="text"
                                    placeholder="Enter Contact Person Email"
                                />
                                <Textinput
                                    label="Contact Person Phone *"
                                    name="contactperson_phone"
                                    onChange={handleChange}
                                    error={errors.contactperson_phone}
                                    register={register}
                                    type="text"
                                    placeholder="Enter Contact Person Phone"
                                />
                                <Textinput
                                    label="Merchant ID"
                                    name="merchant_id"
                                    onChange={handleChange}
                                    error={errors.merchant_id}
                                    register={register}
                                    type="text"
                                    placeholder="Enter Merchant Id"
                                />
                            </div>
                            <div className="ltr:text-right rtl:text-left mt-5">
                                <button className="btn btn-dark mr-5" type="button" onClick={() => navigate('/restaurants')}>
                                    Cancel
                                </button>
                                <button className="btn btn-dark text-center mr-5" type="button" onClick={handleReset}>
                                    {' '}
                                    Reset
                                </button>
                                {updateLoading ? (
                                    <Button className="btn btn-primary text-center" isLoading />
                                ) : (
                                    <button type="submit" className="btn btn-primary text-center">
                                        Submit
                                    </button>
                                )}
                            </div>
                        </form>
                    </Card>
                )
            }
        </>
    )
}

export default EditRestaurant