import React, { useState } from 'react'
import Logo from '@/assets/images/logo/lgo-black-logo.png'
import { useGetClientPosQuery } from '@/api/api'
import Button from '@/components/ui/Button'
import { useDispatch } from 'react-redux'

function PosSelection({ setPosSelected, setDisplayPos }) {
    const dispatch = useDispatch()
    // rtk query
    const {
        data: posData,
        isLoading: dataLoading,
        error: getError,
    } = useGetClientPosQuery()

    // State to track selected POS
    const [selectedPos, setSelectedPos] = useState(null)
    const [selectedPosInfo, setSelectedPosInfo] = useState(null) // To store the selected POS details

    const restaurantName = localStorage.getItem('restaurantName')

    // Function to handle POS selection
    const handlePosSelect = (info) => {
        setSelectedPos(info.slug)
        localStorage.setItem('pos', info?.slug)
        setSelectedPosInfo(info) // Store selected POS info for dynamic URL generation
    }

    const handleContinue = () => {
        setDisplayPos(false)
        setPosSelected(true)
        if (selectedPosInfo) {
            const { appId, oauthRedirectURL, oauthUrl } = selectedPosInfo
            const dynamicOauthUrl = `${oauthUrl}?client_id=${appId}&redirect_uri=${oauthRedirectURL}`
            window.location.href = dynamicOauthUrl
        }
    }

    return (
        <>
            <div className="lg-inner-column">
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="bg-white shadow rounded-md p-4">
                        <div className="text-center mb-8">
                            <img
                                src={Logo}
                                alt=""
                                className="h-8 w-auto mx-auto mb-5"
                            />
                            <div className="text-slate-700 dark:text-slate-400 text-base">
                                Hello {restaurantName}, Please Select Your POS!
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-5 mb-5">
                            {posData?.rows?.map((info) => (
                                <div
                                    onClick={() => handlePosSelect(info)} // Handle POS selection
                                    className={`flex p-4 ${selectedPos === info.slug ? 'border-2 rounded-md border-blue-500' : ''}`}
                                    key={info.slug}
                                >
                                    <div className="flex-0">
                                        <div className="author-img w-[100px] h-[100px] rounded-full overflow-hidden">
                                            <img
                                                src={info.providerLogo}
                                                alt={info.name}
                                                className="w-full h-full object-contain rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            className="btn btn-dark block w-full text-center"
                            text="Continue"
                            disabled={!selectedPos} // Disable if no POS is selected
                            onClick={handleContinue} // Redirect on click
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PosSelection
