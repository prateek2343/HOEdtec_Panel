import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    useGetSingleRestaurantQuery,
    usePostInviteMutation,
    useUpdateRestuarantMutation,
} from '@/api/api'
import SkeletionTable from '@/components/skeleton/Table'
import Button from '@/components/ui/Button'
import GenerateReport from './components/GenerateReport'
import { useGetPosByIdQuery } from '@/api/api'
import Modal from '@/components/ui/Modal'

const SingleRestaurant = () => {
    const params = useParams()
    const id = params.id
    let navigate = useNavigate()

    // Use State
    const [restaurantData, setRestaurantData] = useState(null)
    const [show, setShow] = useState(false);// modal state
    const [link, setLink] = useState(null);

    //  RTK Query hook to fetch restaurant data
    const { data: restaurant, isFetching, isLoading, error: isError, refetch: refetch } = useGetSingleRestaurantQuery({ id })
    const [postInvite, { isLoading: isLoadingInvite, error: inviteError }] = usePostInviteMutation()
    const [updateRestaurant, { error: updateRestaurantError }] = useUpdateRestuarantMutation()
    const { data: pos, isLoading: isLoadingPos, error: posError, } = useGetPosByIdQuery({ slug: restaurant?.pos }, { skip: !restaurant?.pos })

    const copyLink = () => {
        navigator.clipboard.writeText(link).then(() => {
            setShow(false)
        })
    }

    useEffect(() => {
        if (restaurant) {
            setRestaurantData(restaurant)
        }

        if (isError?.status === 404) {
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
            navigate('/404')
        }
    }, [restaurant, isError])

    const sendInvite = async () => {
        try {
            const response = await postInvite({ id: id })
            if (response?.data) {
                setShow(true)
                setLink(response?.data)
                toast.success('Invite Sent successfully', {
                    position: 'top-right',
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
                await updateRestaurant({
                    id: id,
                    data: { invite_Status: 'sent' },
                })
                return
            }
            if (inviteError || response?.error) {
                console.log(
                    'Failed to Send Invite',
                    inviteError || response?.error
                )
                toast.error('Failed to Send Invite', {
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

    return (
        <>
            {show ? <Modal
                title="Invite Link"
                label="Warning"
                labelClass="btn-outline-dark"
                activeModal={show}
                onClose={() => setShow(false)}
                uncontrol={false}
            >
                <Button
                    text="Copy Invite Link"
                    className="btn btn-dark text-center w-full"
                    onClick={() => {
                        copyLink()
                    }}
                />
            </Modal> : null}
            <div className="space-y-5">
                <div className="grid grid-cols-12 gap-5">
                    <div className="xl:col-span-8 lg:col-span-7 col-span-12">
                        {isLoading || isLoadingPos ? (
                            <SkeletionTable count={3} />
                        ) : (
                            <>
                                <Card border>
                                    <div className="border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start mb-3 space-y-4 md:space-y-0 pb-2">
                                        <h4 className="card-title">
                                            {restaurantData?.name}
                                        </h4>
                                        <div className='flex space-x-2'>
                                            {isLoadingInvite ? (
                                                <Button
                                                    text="Get Invite Link"
                                                    className="btn-dark btn-sm"
                                                    isLoading
                                                />
                                            ) : restaurantData?.connection_status ? null : (
                                                <Button
                                                    text="Get Invite Link"
                                                    className="btn-dark btn-sm"
                                                    onClick={() => {
                                                        sendInvite()
                                                    }}
                                                />
                                            )}
                                            {
                                                isFetching ? (
                                                    <Button
                                                        icon="heroicons-outline:arrow-path"
                                                        className="btn-dark btn-sm"
                                                        isLoading
                                                    />
                                                ) : (
                                                    <Button
                                                        icon="heroicons-outline:arrow-path"
                                                        text="Refresh"
                                                        className="btn-dark btn-sm"
                                                        onClick={() => {
                                                            refetch()
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="rounded px-4 pt-4 pb-1 mt-4">
                                        <div className="flex flex-wrap -mx-4">
                                            <div className="w-full px-4">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                            Contact Person Name:
                                                        </div>
                                                        <div className="text-lg font-normal text-slate-800 dark:text-slate-300">
                                                            {
                                                                restaurantData?.contactperson_name
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                            Contact Person Email:
                                                        </div>
                                                        <div className="text-lg font-normal text-slate-800 dark:text-slate-300">
                                                            {
                                                                restaurantData?.contactperson_email
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                            Contact Person Phone:
                                                        </div>
                                                        <div className="text-lg font-normal text-slate-800 dark:text-slate-300">
                                                            {
                                                                restaurantData?.contactperson_phone
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                            Merchant ID:
                                                        </div>
                                                        <div className="text-lg font-normal normal-case text-slate-800 dark:text-slate-300">
                                                            {
                                                                restaurantData?.merchant_id
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                            Invite Status:
                                                        </div>
                                                        <div className="text-lg font-normal capitalize text-slate-800 dark:text-slate-300">
                                                            {
                                                                restaurantData?.invite_Status
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center w-full">
                                                        <div className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                            Connection Status:
                                                        </div>
                                                        <span className="flex items-center">
                                                            <span
                                                                className={`rounded-full bg-opacity-25 p-2 ${restaurantData?.connection_status
                                                                    ? 'text-success-500'
                                                                    : 'text-danger-500'
                                                                    }`}
                                                            >
                                                                {restaurantData?.connection_status
                                                                    ? 'Connected'
                                                                    : 'Not Connected'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {restaurant?.pos && (
                                                        <div className="flex justify-between items-center w-full">
                                                            <div className="text-lg font-semibold capitalize text-slate-800 dark:text-slate-100">
                                                                POS Type:
                                                            </div>
                                                            <div className="text-lg font-normal normal-case text-slate-800 dark:text-slate-300">
                                                                {pos?.name}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                    <div className="xl:col-span-4 lg:col-span-5 col-span-12">
                        <GenerateReport restaurantData={restaurantData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleRestaurant
