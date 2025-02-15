import React, { useState, useMemo, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import { Menu } from '@headlessui/react'
import Icon from '@/components/ui/Icon'
import {
    useTable,
    useRowSelect,
    useSortBy,
    useGlobalFilter,
    usePagination,
} from 'react-table'
import GlobalFilter from './components/GlobalFilter'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { useGetAllRestaurantsQuery, useDeleteRestaurantMutation } from '@/api/api'
import TableSkeleton from '@/components/skeleton/Table'
import { toast } from 'react-toastify'
import Pagination from '@/components/ui/Pagination'
import PaginationButton from '@/components/ui/PaginationButton'
import Modal from '@/components/ui/Modal'

const Restaurants = () => {
    let navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const [totalPages, setTotalPages] = useState(null)
    const [show, setShow] = useState(false);
    const [id, setId] = useState(null);

    const { data: restaurants, isLoading, error: getError, isFetching, refetch: refetch } = useGetAllRestaurantsQuery({ limit: limit, offset: offset })
    const [deleteRestaurant, { isLoading: deleteLoading, error: deleteError }] = useDeleteRestaurantMutation()

    useEffect(() => {
        if (restaurants) {
            setTotalPages(Math.ceil(restaurants?.count / limit))
        }
    }, [restaurants])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        setOffset((page - 1) * limit)
    }

    useEffect(() => {
        if (getError?.originalStatus == 404) {
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

    const COLUMNS = [
        {
            Header: 'Name',
            accessor: 'name',
            Cell: (row) => {
                return (
                    <div
                        className="cursor-pointer"
                        onClick={(e) => {
                            navigate(`/restaurant/${row?.row?.original?.id}`)
                        }}
                    >
                        <span>{row?.cell?.value}</span>
                    </div>
                )
            },
        },
        {
            Header: 'Contact Person Name',
            accessor: 'contactperson_name',
            Cell: (row) => {
                return (
                    <div
                        className="cursor-pointer"
                        onClick={(e) => {
                            navigate(`/restaurant/${row?.row?.original?.id}`)
                        }}
                    >
                        <span>{row?.cell?.value}</span>
                    </div>
                )
            },
        },
        {
            Header: 'Contact Person Email',
            accessor: 'contactperson_email',
            Cell: (row) => {
                return (
                    <div
                        className="cursor-pointer normal-case"
                        onClick={(e) => {
                            navigate(`/restaurant/${row?.row?.original?.id}`)
                        }}
                    >
                        <span>{row?.cell?.value}</span>
                    </div>
                )
            },
        },
        {
            Header: 'Invite Status',
            accessor: 'invite_Status',
            Cell: (row) => {
                return (
                    <div
                        className="cursor-pointer"
                        onClick={(e) => {
                            navigate(`/restaurant/${row?.row?.original?.id}`)
                        }}
                    >
                        <span>{row?.cell?.value}</span>
                    </div>
                )
            },
        },
        {
            Header: 'Connection Status',
            accessor: 'connection_status',
            Cell: (row) => {
                return (
                    <span className="block w-full">
                        <span
                            className={` rounded-[999px] bg-opacity-25 ${row?.cell?.value === true
                                ? 'text-success-500 bg-success-500'
                                : ''
                                }
                ${row?.cell?.value === false
                                    ? 'text-danger-500 bg-danger-500'
                                    : ''
                                }
                
                 `}
                        >
                            ●
                        </span>
                    </span>
                )
            },
        },
        {
            Header: 'action',
            accessor: 'id',
            Cell: (row) => {
                return (
                    <div>
                        <Dropdown
                            classMenuItems="right-0 w-[140px] top-[110%] "
                            label={
                                <span className="text-xl text-center block w-full">
                                    <Icon icon="heroicons-outline:dots-vertical" />
                                </span>
                            }
                        >
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {actions.map((item, i) => (
                                    <Menu.Item
                                        key={i}
                                        onClick={() => {
                                            item.doit(row?.cell?.value)
                                        }}
                                    >
                                        <div
                                            className={`
      
                          ${item.name === 'delete'
                                                    ? 'bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white'
                                                    : 'hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50'
                                                }
                           w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                           first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
                                        >
                                            <span className="text-base">
                                                <Icon icon={item.icon} />
                                            </span>
                                            <span>{item.name}</span>
                                        </div>
                                    </Menu.Item>
                                ))}
                            </div>
                        </Dropdown>
                    </div>
                )
            },
        },
    ]

    const actions = [
        {
            name: 'edit',
            icon: 'heroicons:pencil-square',
            doit: (id) => {
                navigate(`/restaurant/${id}/edit`)
            },
        },
        {
            name: "delete",
            icon: "heroicons-outline:trash",
            doit: (id) => {
                setShow(true);
                setId(id);
            },
        },
    ]

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => restaurants?.rows || [], [restaurants])

    const tableInstance = useTable(
        {
            columns,
            data,
        },

        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state,
        gotoPage,
        pageCount,
        setPageSize,
        setGlobalFilter,
        prepareRow,
    } = tableInstance

    const { globalFilter, pageIndex, pageSize } = state

    const handleDelete = async ({ id }) => {
        try {
            const response = await deleteRestaurant({ id })
            if (response?.data) {
                toast.success("Deleted successfully", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setShow(false);
                await refetch();
            }
            if (deleteError || response?.error) {
                console.log("Failed to Delete", deleteError);
                toast.error("Failed to Delete", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setShow(false);
            }
        } catch (error) {
            setShow(false);
            console.error("Error Deleting User:", error);
        }
    };

    return (
        <>
            {show ? <Modal
                title="Warning"
                label="Warning"
                labelClass="btn-outline-warning"
                themeClass="bg-warning-500"
                activeModal={show}
                onClose={() => setShow(false)}
                uncontrol={false}
                footerContent={
                    <>
                        {
                            deleteLoading ? (
                                <Button
                                    text="Yes"
                                    className="btn-warning"
                                    isLoading
                                />
                            ) : (
                                <Button
                                    text="Yes"
                                    className="btn-warning"
                                    onClick={() => {
                                        handleDelete({ id })
                                    }
                                    }
                                />
                            )
                        }
                        <Button
                            text="No"
                            className="btn-warning"
                            onClick={() => {
                                setShow(false);
                            }}
                        />
                    </>

                }
            >
                <h4 className="font-medium text-lg mb-3 text-slate-900">
                    Do you want to delete this Restaurant?
                </h4>
            </Modal> : null}
            {isLoading || isFetching ? (
                <TableSkeleton />
            ) : (
                <Card noborder>
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 space-y-4 md:space-y-0">
                        <h4 className="card-title">Restaurants</h4>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0 md:space-x-4">
                            <Button
                                icon="heroicons-outline:plus"
                                text="Add Restaurant"
                                className="btn-dark w-full md:w-auto btn-sm"
                                onClick={() => {
                                    navigate('/restaurant/add')
                                }}
                            />
                        </div>
                    </div>
                    <div className="-mx-6">
                        <div className="inline-block min-w-full align-middle">
                            <div className="">
                                <table
                                    className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                                    {...getTableProps}
                                >
                                    <thead className=" border-t border-slate-100 dark:border-slate-800">
                                        {headerGroups.map((headerGroup) => (
                                            <tr
                                                {...headerGroup.getHeaderGroupProps()}
                                            >
                                                {headerGroup.headers.map(
                                                    (column) => (
                                                        <th
                                                            {...column.getHeaderProps(
                                                                column.getSortByToggleProps()
                                                            )}
                                                            scope="col"
                                                            className=" table-th "
                                                        >
                                                            {column.render(
                                                                'Header'
                                                            )}
                                                            <span>
                                                                {column.isSorted
                                                                    ? column.isSortedDesc
                                                                        ? ' 🔽'
                                                                        : ' 🔼'
                                                                    : ''}
                                                            </span>
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                                        {...getTableBodyProps}
                                    >
                                        {page.map((row) => {
                                            prepareRow(row)
                                            return (
                                                <tr {...row.getRowProps()}>
                                                    {row.cells.map((cell) => {
                                                        return (
                                                            <td
                                                                {...cell.getCellProps()}
                                                                className="table-td"
                                                            >
                                                                {cell.render(
                                                                    'Cell'
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
                        <div className=" flex items-center space-x-3 rtl:space-x-reverse">
                            <span className=" flex space-x-2  rtl:space-x-reverse items-center">
                                <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Go
                                </span>
                                <span>
                                    <span>
                                        <PaginationButton
                                            totalPages={totalPages}
                                            currentPage={currentPage}
                                            handlePageChange={handlePageChange}
                                        />
                                    </span>
                                </span>
                            </span>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                Page{' '}
                                <span>
                                    {currentPage} of {totalPages}
                                </span>
                            </span>
                        </div>
                        <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                            />
                        </ul>
                    </div>
                </Card>
            )}
        </>
    )
}

export default Restaurants
