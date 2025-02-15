import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginForm from './common/login-form'
import Social from './common/social'
import useDarkMode from '@/hooks/useDarkMode'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'

// image import
import LogoWhite from '@/assets/images/logo/logo-white.svg'
import Logo from '@/assets/images/logo/lgo-black-logo.png'
import Illustration from '@/assets/images/auth/bg.png'

const login = () => {
    const navigate = useNavigate()
    const [isDark] = useDarkMode()
    const { openOTPScreen, isAuth } = useSelector((state) => state.auth)

    useEffect(() => {
        if (isAuth) {
            navigate('/dashboard')
        }
    }, [isAuth, navigate])
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
                            <div className="auth-box h-full flex flex-col justify-center">
                                <div className="mobile-logo text-center mb-6 lg:hidden block"></div>
                                <div className="text-center 2xl:mb-10 mb-4">
                                    <h4 className="font-medium">LGO Sign in</h4>
                                    <div className="text-slate-500 text-base">
                                        Sign in to your account to start using
                                        LGO
                                    </div>
                                    {openOTPScreen ? (
                                        <div className="text-slate-500 text-base">
                                            Enter OTP
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 text-base"></div>
                                    )}
                                </div>
                                <LoginForm />
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

export default login
