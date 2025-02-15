import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
// public pages
const Login = lazy(() => import('./pages/auth/login'))
const ForgotPass = lazy(() => import('./pages/auth/forgot-password'))
// main pages
const Dashboard = lazy(() => import('./pages/dashboard'))
const POS = lazy(() => import('./pages/main/Pos'))
const Restaurants = lazy(() => import('./pages/main/restaurants'))
const Team = lazy(() => import('./pages/main/team/index'))
const DetailPage = lazy(() => import('./pages/main/restaurants/DetailPage'))
const Complete = lazy(() => import('./pages/main/POS_Connect/Complete'))
const Connect = lazy(() => import('./pages/main/POS_Connect/index'))
const Privacy = lazy(() => import('./pages/main/PrivacyPolicy/index'))
import Layout from './layout/Layout'
import Loading from '@/components/Loading'
const EditRestaurant = lazy(() => import('./pages/main/restaurants/EditRestaurant'))
const AdminProfile = lazy(() => import('./pages/main/team/AdminProfile'))
const UserEditPage = lazy(() => import('./pages/main/team/EditMember'))
const UserAddPage = lazy(() => import('./pages/main/team/AddMember'))
const MemberProfile = lazy(() => import('./pages/main/team/MemberPage'))
const AddRestaurant = lazy(() => import('./pages/main/restaurants/AddRestaurant'))
const Error = lazy(() => import('./pages/404'))

function App() {
    return (
        <main className="App relative">
            <Routes>
                {/* Public routes */}
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Login />
                        </Suspense>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <Suspense fallback={<Loading />}>
                            <ForgotPass />
                        </Suspense>
                    }
                />
                <Route
                    path="/connect"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Connect />
                        </Suspense>
                    }
                />
                <Route
                    path="/complete"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Complete />
                        </Suspense>
                    }
                />
                <Route
                    path="/privacy-policy"
                    element={
                        <Suspense fallback={<Loading />}>
                            <Privacy />
                        </Suspense>
                    }
                />
                {/* Protected routes */}
                <Route path="/*" element={<Layout />}>
                    <Route path="team" element={<Team />} />
                    <Route path="team/:id/profile" element={<MemberProfile />} />
                    <Route path="team/add" element={<UserAddPage />} />
                    <Route path="team/:id/edit" element={<UserEditPage />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="*" element={<Navigate to="/404" />} />
                </Route>
                {/* 404 page */}
                <Route
                    path="/404"

                    element={
                        <Suspense fallback={<Loading />}>
                            <Error />
                        </Suspense>
                    }
                />
            </Routes>
        </main>
    )
}

export default App
