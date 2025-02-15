import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import {
    usePostReportGnerateMutation,
    usePostRestaurantRefreshMutation,
} from '@/api/api'
import ReportSelect from './ReportTypeSelect'

function GenerateReport({ restaurantData }) {
    const [picker, setPicker] = useState(new Date())
    const [exp, setExp] = useState(new Date())
    const [report, setReport] = useState(null)
    const [
        postGenerateReport,
        { isLoading: reportLoading, error: reportError },
    ] = usePostReportGnerateMutation()
    const [refreshCall, { isLoading: refreshLoading, error: refreshError }] =
        usePostRestaurantRefreshMutation()

    // Schema validation using yup
    const schema = yup.object({}).required()

    const {
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const formattedStartTime = format(picker, "yyyy-MM-dd'T'HH:mm:ss")
    const formattedEndTime = format(exp, "yyyy-MM-dd'T'HH:mm:ss")

    const onSubmit = async () => {
        try {
            const response = await postGenerateReport({
                id: restaurantData.id,
                data: {
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    report_type: report,
                },
            })
            if (response?.data) {
                toast.success('Report Generated successfully', {
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
            if (
                response?.error?.status === 401 ||
                response?.error?.data?.message === '401 Unauthorized'
            ) {
                const refreshCallAPI = await refreshCall({
                    id: restaurantData.id,
                })
            }
            if (reportError || response?.error) {
                console.log('Failed to Generate Report', response?.error)
                toast.error('Failed to Generate Report', {
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
            console.log(error)
        }
    }

    return (
        <>
            <Card noborder>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid lg:grid-cols-2 gap-5">
                        <div>
                            <label className="form-label" htmlFor="hf-picker">
                                Start Time
                            </label>
                            <Flatpickr
                                value={picker}
                                id="hf-picker"
                                className="form-control py-2"
                                onChange={(date) => setPicker(date[0])} // Ensure you get the first selected date
                            />
                        </div>
                        <div>
                            <label
                                className="form-label"
                                htmlFor="hf-picker-end"
                            >
                                End Time
                            </label>
                            <Flatpickr
                                value={exp}
                                id="hf-picker-end"
                                className="form-control py-2"
                                onChange={(date) => setExp(date[0])}
                            />
                        </div>
                        <ReportSelect
                            multi={false}
                            isDisabled={false}
                            setReport={setReport}
                        />
                    </div>
                    <div className="ltr:text-right rtl:text-left mt-5">
                        {reportLoading ? (
                            <Button
                                type="button"
                                className="btn btn-primary text-center"
                                isLoading
                            />
                        ) : restaurantData?.connection_status ? (
                            <Button
                                type="submit"
                                className="btn btn-primary text-center"
                                text="Submit"
                            />
                        ) : (
                            <Button
                                className="btn btn-primary text-center"
                                text="Submit"
                                disabled
                            />
                        )}
                    </div>
                </form>
            </Card>
        </>
    )
}

export default GenerateReport
