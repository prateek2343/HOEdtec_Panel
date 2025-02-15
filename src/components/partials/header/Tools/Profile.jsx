import React from 'react'
import Dropdown from '@/components/ui/Dropdown'
import Icon from '@/components/ui/Icon'
import { Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { handleLogout } from '@/pages/auth/common/store'
import Avatar from '@mui/material/Avatar'

const profileLabel = () => {
    function stringToColor(string) {
        let hash = 0
        let i

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash)
        }

        let color = '#'

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff
            color += `00${value.toString(16)}`.slice(-2)
        }
        /* eslint-enable no-bitwise */

        return color
    }

    function stringAvatar(name) {
        // Split the name into parts
        const parts = name.split(' ')

        // get naame from local storage, considering both single and double name cases
        const initials =
            parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : `${parts[0][0]}`

        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: initials,
        }
    }

    const userName = localStorage.getItem('Fullname')
    return (
        <div className="flex items-center">
            <div className="flex-1 ltr:mr-4 rtl:ml-4 flex items-center">
                <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
                    <span className="block w-full h-full object-cover rounded-full avatar text-bg-primary">
                        <Avatar {...stringAvatar(userName)} />
                    </span>
                </div>
            </div>
            <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[100px] block text-black capitalize font-medium">
                    {userName}
                </span>
                <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
                    <Icon icon="heroicons-outline:chevron-down"></Icon>
                </span>
            </div>
        </div>
    )
}

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const ProfileMenu = [
        {
            label: "Profile",
            icon: "heroicons-outline:user",
            action: () => {
                navigate("/profile");
            },
        },
        {
            label: 'Logout',
            icon: 'heroicons-outline:login',
            action: () => {
                dispatch(handleLogout(false))
            },
        },
    ]

    return (
        <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
            {ProfileMenu.map((item, index) => (
                <Menu.Item key={index}>
                    {({ active }) => (
                        <div
                            onClick={() => item.action()}
                            className={`${active
                                ? 'bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50'
                                : 'text-slate-600 dark:text-slate-300'
                                } block     ${item.hasDivider
                                    ? 'border-t border-slate-100 dark:border-slate-700'
                                    : ''
                                }`}
                        >
                            <div className={`block cursor-pointer px-4 py-2`}>
                                <div className="flex items-center">
                                    <span className="block text-xl ltr:mr-3 rtl:ml-3">
                                        <Icon icon={item.icon} />
                                    </span>
                                    <span className="block text-sm">
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </Menu.Item>
            ))}
        </Dropdown>
    )
}

export default Profile
