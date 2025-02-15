import React from 'react'
import { Link } from 'react-router-dom'
import ForgotPass from './common/forgot-pass'
import useDarkMode from '@/hooks/useDarkMode'

import LogoWhite from '@/assets/images/logo/logo-white.svg'
import Logo from '@/assets/images/logo/lgo-black-logo.png'
import Illustration from '@/assets/images/auth/bg.png'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

const forgotPass = () => {
    const { openOTPScreen } = useSelector((state) => state.auth)
    const [isDark] = useDarkMode()
    return (
        <>
            <ToastContainer />
            <div className="loginwrapper">
                <div className="lg-inner-column">
                    <div className="left-column relative !bg-white z-[1]">
                        <div className="pt-5 ltr:pl-3">
                            <Link to="/">
                                <img
                                    src={isDark ? LogoWhite : Logo}
                                    alt=""
                                    className="h-12"
                                />
                            </Link>
                        </div>
                        <div className="absolute left-0 h-full w-full z-[-1]">
                            <img
                                src={Illustration}
                                alt=""
                                className="h-full w-full object-contain ml-4"
                            />
                        </div>
                    </div>
                    <div className="right-column relative">
                        <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
                            <div className="auth-box2 flex flex-col justify-center h-full">
                                <div className="mobile-logo text-center mb-6 lg:hidden block">
                                    <Link to="/">
                                        <img
                                            src={isDark ? LogoWhite : Logo}
                                            alt=""
                                            className="mx-auto"
                                        />
                                    </Link>
                                </div>
                                <div className="text-center 2xl:mb-10 mb-5">
                                    <h4 className="font-medium mb-4">
                                        Forgot Your Password?
                                    </h4>
                                    <div className="text-slate-500 dark:text-slate-400 text-base">
                                        Reset Password with LGO.
                                    </div>
                                    {openOTPScreen ? (
                                        <div className="text-slate-500 text-base">
                                            Enter OTP To Reset Your Password
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 text-base"></div>
                                    )}
                                </div>

                                <ForgotPass />
                                <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 uppercase text-sm">
                                    <Link
                                        to="/"
                                        className="text-slate-500 dark:text-white font-medium hover:underline"
                                    >
                                        Go Back To Sign In
                                    </Link>
                                </div>
                            </div>
                            <div className="auth-footer text-center">
                                Copyright 2025, Let's Get Offline All Rights
                                Reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default forgotPass
