import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import {
    useTable,
    useRowSelect,
    useSortBy,
    useGlobalFilter,
    usePagination,
} from "react-table";
import GlobalFilter from "../components/GlobalFilter";
import Modal from '@/components/ui/Modal'
import TableSkeleton from "@/components/skeleton/Table"
import { toast } from "react-toastify";
import Pagination from "@/components/ui/Pagination";
import PaginationButton from "@/components/ui/PaginationButton";
import { useGetAllTeamMembersQuery, useDeleteTeamMemberMutation } from "@/api/api";

function index() {
    let navigate = useNavigate();
    const [id, setId] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [totalPages, setTotalPages] = useState(null);

    const { data: adminUserData, isLoading: apiLoading, error: getError } = useGetAllTeamMembersQuery({ limit: limit, offset: offset })
    const [deleteUser, { error: deleteError }] = useDeleteTeamMemberMutation()

    useEffect(() => {
        if (adminUserData) {
            setTotalPages(Math.ceil(adminUserData?.count / limit))
        }
    }, [adminUserData])
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setOffset((page - 1) * limit);
    };


    useEffect(() => {
        if (getError?.originalStatus == 404) {
            toast.error("No Data Found", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }, [getError])

    const handleDelete = async ({ id }) => {
        const response = await deleteUser({ id })
        try {
            if (response?.status === 200) {
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
            }
            if (response?.error?.status === 403) {
                toast.error("Not Allowed to Delete", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            if (deleteError) {
                console.log("Failed to Delete Team Member", deleteError);
                toast.error("Failed to Delete Team Member", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error("Error Deleting User:", error);
        }
    };

    const actions = [
        {
            name: "edit",
            icon: "heroicons:pencil-square",
            doit: (id) => {
                navigate(`/team/${id}/edit`)
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
    ];

    const COLUMNS = [
        {
            Header: "User",
            accessor: "fullName",
            Cell: (row) => {
                const temp = row?.row?.values?.id
                return (
                    <div style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            navigate(`/team/${temp}/profile`);
                        }}>
                        <span className="inline-flex items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                                {row?.cell?.value}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "Email",
            accessor: "username",
            Cell: (row) => {
                const temp = row?.row?.values?.id
                return (
                    <div style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            navigate(`/team/${temp}/profile`);
                        }}>
                        <span className="inline-flex items-center">
                            <span className="text-sm normal-case text-slate-600 dark:text-slate-300">
                                {row?.cell?.value}
                            </span>
                        </span>
                    </div>
                );
            },
        },
        {
            Header: "action",
            accessor: "id",
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
                                    <Menu.Item key={i} onClick={() => item.doit(row?.cell?.value)}>
                                        <div
                                            className={`
                        
                          ${item.name === "delete"
                                                    ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                                                    : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
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
                );
            },
        },
    ];
    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => adminUserData?.rows || [], [adminUserData]);
    const [show, setShow] = useState(false);

    const tableInstance = useTable(
        {
            columns,
            data,
        },

        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
    );
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
    } = tableInstance;

    const { globalFilter, pageIndex, pageSize } = state;
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
                        <Button
                            text="Yes"
                            className="btn-warning"
                            onClick={() => {
                                setShow(false);
                                handleDelete({ id })
                            }}
                        />
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
                    Do you want to delete this Member?
                </h4>
            </Modal> : null}
            {apiLoading ? (
                <TableSkeleton />
            ) : (
                <Card noborder>
                    <div className="md:flex pb-6 items-center mb-6">
                        <h4 className="flex-1 md:mb-0 mb-3">Team</h4>
                        <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
                            <Button
                                icon="heroicons-outline:plus-sm"
                                text="Create New Member"
                                className=" btn-dark font-normal btn-sm "
                                iconClass="text-lg"
                                onClick={() => {
                                    navigate(`/team/add`)
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
                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                {headerGroup.headers.map((column) => (
                                                    <th
                                                        {...column.getHeaderProps(
                                                            column.getSortByToggleProps()
                                                        )}
                                                        scope="col"
                                                        className=" table-th "
                                                    >
                                                        {column.render("Header")}
                                                        <span>
                                                            {column.isSorted
                                                                ? column.isSortedDesc
                                                                    ? " 🔽"
                                                                    : " 🔼"
                                                                : ""}
                                                        </span>
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody
                                        className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                                        {...getTableBodyProps}
                                    >
                                        {page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr {...row.getRowProps()}>
                                                    {row.cells.map((cell) => {
                                                        return (
                                                            <td {...cell.getCellProps()} className="table-td">
                                                                {cell.render("Cell")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
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
                                    <PaginationButton totalPages={totalPages}
                                        currentPage={currentPage}
                                        handlePageChange={handlePageChange} />
                                </span>
                            </span>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                Page{" "}
                                <span>
                                    {currentPage} of {totalPages}
                                </span>
                            </span>
                        </div>
                        <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
                            <Pagination totalPages={totalPages}
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                            />
                        </ul>
                    </div>
                </Card>
            )}
        </>
    );
};

export default index