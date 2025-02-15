import React, { useEffect } from 'react'
import Card from '@/components/ui/Card'
import { useGetAllPosQuery } from '@/api/api'
import TableSkeleton from '@/components/skeleton/Table'
import { toast } from 'react-toastify'

const POSList = () => {
    // rtk query
    const {
        data: posData,
        isLoading: dataLoading,
        error: getError,
    } = useGetAllPosQuery()

    useEffect(() => {
        if (getError?.originalStatus === 404) {
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
    }, [getError])

    return (
        <>
            {dataLoading ? (
                <TableSkeleton />
            ) : (
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5">
                    {posData?.rows?.map((info) => (
                        <Card key={info.slug}>
                            <div className="flex">
                                <div className="flex-0 mr-6">
                                    <div className="author-img w-[100px] h-[100px] rounded-full overflow-hidden">
                                        <img
                                            src={info.providerLogo}
                                            alt={info.name}
                                            className="w-full h-full object-contain rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2 mt-3 text-base">
                                        {info.name}
                                    </div>
                                    <div className="space-x-5">
                                        <span className="inline-block text-base">
                                            {info.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </>
    )
}

export default POSList
