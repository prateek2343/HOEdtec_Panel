import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetTeamMemberQuery } from "@/api/api";
import { useNavigate, useParams } from "react-router-dom";
import TableSkeleton from "@/components/skeleton/Table"

const FormValidationSchema = yup.object({
    fullName: yup.string().required("Full name is required"),
    phoneNumber: yup.string().required("Contact Number is required"),
}).required();

const MemberProfile = () => {
    const params = useParams();
    let navigate = useNavigate()
    let id = params.id;
    const { data: singleRoleData, isLoading, error: isError } = useGetTeamMemberQuery({ id });

    useEffect(() => {
        if (isError?.status == 404) {
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
            navigate('/404')
        }

    }, [isError])

    const { register, formState: { errors }, handleSubmit, setValue } = useForm({
        resolver: yupResolver(FormValidationSchema),
    });

    const AddExistingdata = () => {
        if (singleRoleData) {
            setValue("fullName", singleRoleData.fullName || "");
            setValue("username", singleRoleData.username || "");
        }
    };

    useEffect(() => {
        AddExistingdata();
    }, [singleRoleData]);


    const handleChange = (e) => {
        setValue(e.target.name, e.target.value || "");
    };

    return (
        <>
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <div>
                    <Card title="Member Profile">
                        <form onSubmit={handleSubmit()}>
                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                                <Textinput
                                    label="Email"
                                    name="username"
                                    onChange={handleChange}
                                    error={errors.username}
                                    register={register}
                                    type="text"
                                    placeholder="Email"
                                    disabled={true}
                                />
                                <Textinput
                                    label="Full Name"
                                    name="fullName"
                                    onChange={handleChange}
                                    error={errors.fullName}
                                    register={register}
                                    type="text"
                                    placeholder="Enter Full Name"
                                    disabled={true}
                                />
                            </div>
                        </form>
                    </Card>
                </div>
            )
            }
        </>
    );
};

export default MemberProfile;
