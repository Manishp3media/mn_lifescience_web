import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginAdmin } from '@/redux/authSlice';
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import CustomSpinner from "@/adminComponents/CustomSpinner";
import { toast } from "react-toastify";

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        dispatch(loginAdmin(values)).then((result) => {
            // Check if the request was fulfilled successfully
            if (result.meta.requestStatus === 'fulfilled') {
                toast.success("Signed In Successfully!", { autoClose: 3000 });
                navigate('/admin/dashboard/enquries');
                
            } else if (result.error && result.error.status === 400) {
                // If the status is 400, show invalid credentials error
                toast.error("Invalid credentials. Please check your email and password.");
            } else {
                // Handle other error statuses if needed
                toast.error("An error occurred. Please try again.");
            }
        }).finally(() => {
            // Stop the submission loader or any ongoing action
            setSubmitting(false);
        });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-8 bg-white rounded-md">
                <h2 className="text-2xl font-bold mb-6 text-[#386D62]">Admin Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Field
                                    name="email"
                                    as={Input} // Use Shadcn Input component
                                    className="mt-1 block w-full" // You can customize the styles
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Field
                                    name="password"
                                    as={Input} // Use Shadcn Input component
                                    type="password"
                                    className="mt-1 block w-full" // You can customize the styles
                                />
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <ErrorMessage name="general" component="div" className="text-red-600 text-sm mb-2" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full bg-[#386D62] text-white py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-[#2C524C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#386D62]"
                            >
                                {loading ? <CustomSpinner size={20} /> : 'Login'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AdminLogin;
