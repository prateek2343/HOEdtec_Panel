import React from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usePostAdminMutation } from "@/api/api";
import Button from '@/components/ui/Button'

const FormValidationSchema = yup
    .object({
        fullName: yup.string().required("User Name is required"),
        username: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string().required("Password is required"),
    })
    .required();

const UserAddPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createAdmin, { isLoading: adminPostLoading, error: adminPostError }] = usePostAdminMutation()

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
    });

    const handleChange = (e) => {
        setValue(e.target.name, e.target.value || "")
    };

    const handleReset = () => {
        reset();
    };


    const onSubmit = async (data) => {
        try {
            const finalData = {
                ...data,
                "default": false
            }
            let response = await createAdmin(finalData);
            if (response?.data) {
                toast.success("Admin Created successfully", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                navigate("/team");
            }
            if (adminPostError || response?.error) {
                if (response?.error?.data?.message === `Admin already exist with ${data.username}`) {
                    toast.error(response?.error?.data?.message, {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    return
                }
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
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <Card title="Add New Member">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid  grid-cols-1 gap-5">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                            <Textinput
                                label="Full Name *"
                                name="fullName"
                                onChange={handleChange}
                                error={errors.fullName}
                                register={register}
                                type="text"
                                placeholder="Add your name"
                            />
                            <Textinput
                                label="Email *"
                                type="email"
                                onChange={handleChange}
                                name="username"
                                error={errors.username}
                                register={register}
                                placeholder="Add your email"
                            />
                            <Textinput
                                label="Password *"
                                type="password"
                                onChange={handleChange}
                                name="password"
                                error={errors.password}
                                register={register}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="ltr:text-right rtl:text-left mt-5">
                        <button className="btn btn-dark mr-5" type="button" onClick={() => navigate("/team")}>Cancel</button>
                        <button className="btn btn-dark text-center mr-5" type="button" onClick={handleReset}> Reset</button>
                        {
                            adminPostLoading ? (
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

export default UserAddPage;
