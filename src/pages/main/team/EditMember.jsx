import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetTeamMemberQuery, useUpdateMemberMutation } from "@/api/api";

const FormValidationSchema = yup
    .object({
        fullName: yup.string().required("User Name is required"),
        username: yup.string().email("Invalid email").required("Email is required"),
    })
    .required();

const UserEditPage = () => {
    const params = useParams();
    let id = params.id;

    const [updateLoading, setUpdateLoading] = useState(false)
    const [updateData] = useUpdateMemberMutation();
    const { data: singleMemberData, isLoading, error: isError } = useGetTeamMemberQuery({ id });

    const AddExistingdata = () => {
        if (singleMemberData) {
            setValue("fullName", singleMemberData.fullName || "");
            setValue("username", singleMemberData.username || "");
        }
    };

    useEffect(() => {
        AddExistingdata();
    }, [singleMemberData]);

    const navigate = useNavigate()
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
    });

    const handleChange = (e) => {
        setValue(e.target.name, e.target.value || "")
    };
    const handleReset = () => {
        AddExistingdata();
    }

    const onSubmit = async (data) => {
        try {
            setUpdateLoading(true)
            const res = await updateData({ id, data });
            if (res?.data) {
                toast.success("Status updated successfully", {
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
                console.error("Error creating dataset", res);
                toast.error("Failed to create dataset", {
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
        <div>
            <Card title="Edit Member">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-5">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                            <Textinput
                                label="Full Name"
                                name="fullName"
                                onChange={handleChange}
                                error={errors.fullName}
                                register={register}
                                type="text"
                                placeholder="Add your name"
                            />
                            <Textinput
                                label="Email"
                                type="email"
                                onChange={handleChange}
                                name="username"
                                error={errors.username}
                                register={register}
                                placeholder="Add your email"
                            />
                        </div>
                    </div>

                    <div className="ltr:text-right rtl:text-left mt-5">
                        <button className="btn btn-dark mr-5" type="button" onClick={() => navigate("/team")}>Cancel</button>
                        <button className="btn btn-dark text-center mr-5" type="button" onClick={handleReset}>Reset</button>
                        {
                            updateLoading ? (
                                <Button type="submit" className="btn btn-primary text-center" isLoading />
                            ) : (
                                <button type="submit" className="btn btn-primary text-center">Submit </button>
                            )
                        }
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default UserEditPage;