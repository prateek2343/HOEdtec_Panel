import React, { useEffect, useState } from 'react'
import Logo from '@/assets/images/logo/lgo-black-logo.png'
import bgImage from '@/assets/images/all-img/login-bg.png'
import Button from '@/components/ui/Button'
import axios from 'axios';

function Complete() {
    const urlParams = new URLSearchParams(window.location.search)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState(false)
    const [tokenLoading, setTokenLoading] = useState(false)
    const restaurantId = localStorage.getItem('restaurantId')
    const token = localStorage.getItem('inviteToken')
    const Client_ID = urlParams.get('client_id')
    const Code = urlParams.get('code')
    const pos = localStorage.getItem('pos')
    const merchantId = urlParams.get('merchant_id')
    const baseURL = `${import.meta.env.VITE_API_URL}/api/v1`

    const addToken = async () => {
        setTokenLoading(true)
        try {
            const data = {
                clientId: Client_ID,
                code: Code,
                slug: pos,
                restaurantId: restaurantId,
                merchantId: merchantId,
            };
            // Axios POST request
            const response = await axios.post(`${baseURL}/client/token`, data);

            // Check the response status
            if (response?.status === 200) {
                setTokenLoading(false)
                setIsConnected(true); // Set connection status to true
            }
        } catch (error) {
            setTokenLoading(false)
            setError(true)
            console.log('Error in setting up request:', error);
        }
    };

    const Retry = () => {
        const dynamicOauthUrl = `/connect?token=${token}`
        window.location.href = dynamicOauthUrl
    }

    useEffect(() => {
        if (Client_ID && Code && pos && restaurantId) {
            addToken()
        }
    }, [Client_ID, Code, pos, restaurantId])

    return (
        <div
            className="loginwrapper bg-cover bg-no-repeat bg-center"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <div className="lg-inner-column">
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="auth-box-custom">
                        <div className="text-center mb-8">
                            <img
                                src={Logo}
                                alt=""
                                className="h-8 w-auto mx-auto mb-5"
                            />
                            {tokenLoading && (
                                <>
                                    <div className="text-slate-500 dark:text-slate-400 text-base">
                                        Connecting Your POS!
                                    </div>
                                    <div className="flex items-center justify-center mt-4">
                                        <svg
                                            aria-hidden="true"
                                            class="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                    </div>
                                </>
                            )}
                            {isConnected && (
                                <>
                                    <div className="text-slate-500 dark:text-slate-400 text-base">
                                        POS Connected Successfully!
                                    </div>
                                    <Button
                                        className="btn btn-dark block w-full text-center mt-4"
                                        text="Close The Tab"
                                        onClick={() => window.close()}
                                    />
                                </>
                            )}
                            {error && (
                                <>
                                    <div className="text-slate-500 dark:text-slate-400 text-base">
                                        Failed To Connect Pos!
                                    </div>
                                    <Button
                                        className="btn btn-dark block w-full text-center mt-4"
                                        text="Retry"
                                        onClick={() => Retry()}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Complete
