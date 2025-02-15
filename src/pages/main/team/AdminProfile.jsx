import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useGetTeamMemberQuery, useUpdateMemberMutation } from "@/api/api";
import TableSkeleton from "@/components/skeleton/Table"

const FormValidationSchema = yup.object({
    fullName: yup.string().required("Full name is required"),
    username: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
}).required();

const AdminProfile = () => {
    const id = localStorage.getItem("adminId");

    const [updateLoading, setUpdateLoading] = useState(false)
    const [updateData] = useUpdateMemberMutation();
    const { data: singleRoleData, isLoading, error: isError } = useGetTeamMemberQuery({ id });

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

    const onSubmit = async (data) => {
        try {
            setUpdateLoading(true)
            const res = await updateData({ id, data });
            if (res?.data) {
                toast.success("updated successfully", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setUpdateLoading(false)
                navigate("/team");
            } else {
                setUpdateLoading(false)
                console.error("Error Updating", res);
                toast.error("Failed to Update", {
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
            setUpdateLoading(false)
            console.error("Error:", error);
        }
    };

    return (
        <>
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <Card title="Admin Profile">
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Textinput
                                label="Change Password"
                                name="password"
                                onChange={handleChange}
                                error={errors.password}
                                register={register}
                                type="password"
                                placeholder="Enter New Password"
                            />
                        </div>
                        <div className="ltr:text-right rtl:text-left mt-5">
                            {
                                updateLoading ? (
                                    <Button type="submit" className="btn btn-primary text-center" isLoading />
                                ) : (
                                    <button type="submit" className="btn btn-primary text-center">Update </button>
                                )
                            }
                        </div>
                    </form>
                </Card>
            )}
        </>
    );
};

export default AdminProfile;