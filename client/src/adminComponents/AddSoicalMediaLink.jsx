import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSocialMediaLink, fetchSocialMediaLinks } from "@/redux/socialMediaSlice";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import the loader icon

const AddSocialMediaLink = ({ isSocialMediaLinkOpen, onSocialMediaLinkClose }) => {
    const dispatch = useDispatch();
    const { socialMediaLinks, fetchLoading, addLoading } = useSelector((state) => state.socialMediaLink);

    useEffect(() => {
        dispatch(fetchSocialMediaLinks());
    }, [dispatch]);

    // Initialize formik after data is loaded
    const formik = useFormik({
        enableReinitialize: true, // This will reinitialize the form when initialValues change
        initialValues: {
            adminEmail: socialMediaLinks?.[0]?.adminEmail || "",
            adminMobileNumber: socialMediaLinks?.[0]?.adminMobileNumber || "",
            whatsappNumber: socialMediaLinks?.[0]?.whatsappNumber || "",
            instagram: socialMediaLinks?.[0]?.instagram || "",
            facebook: socialMediaLinks?.[0]?.facebook || "",
            twitter: socialMediaLinks?.[0]?.twitter || "",
            linkedin: socialMediaLinks?.[0]?.linkedin || "",
        },
        validationSchema: Yup.object({
            adminEmail: Yup.string().email("Invalid email format").optional(),
            adminMobileNumber: Yup.string().length(10, "Mobile Number must be exactly 10 digits").optional(),
            whatsappNumber: Yup.string().length(10, "Mobile Number must be exactly 10 digits").optional(),
            instagram: Yup.string().optional(),
            facebook: Yup.string().optional(),
            twitter: Yup.string().optional(),
            linkedin: Yup.string().optional(),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            for (let key in values) {
                formData.append(key, values[key]);
            }

            try {
                await dispatch(addSocialMediaLink(formData)).unwrap();
                toast.success("Social media link added successfully");
                formik.resetForm();
            } catch (error) {
                return rejectWithValue({
                    error: error.response?.data?.message || "Failed to add social media link",
                  });
            } finally {
                onSocialMediaLinkClose();
            }
        },
    });

    if (fetchLoading) {
        return (
            <Dialog open={isSocialMediaLinkOpen} onOpenChange={onSocialMediaLinkClose}>
                <DialogContent>
                    <div className="flex items-center justify-center min-h-[200px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading social media details...</span>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isSocialMediaLinkOpen} onOpenChange={onSocialMediaLinkClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Social Media Link</DialogTitle>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="adminEmail" className="block text-sm font-medium">Admin Email</label>
                        <Input
                            id="adminEmail"
                            name="adminEmail"
                            type="email"
                            value={formik.values.adminEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input"
                        />
                        {formik.touched.adminEmail && formik.errors.adminEmail && (
                            <p className="text-red-600">{formik.errors.adminEmail}</p>
                        )}
                    </div>

                    {/* Two fields in one row */}
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <label htmlFor="adminMobileNumber" className="block text-sm font-medium">Admin Mobile Number</label>
                            <Input
                                id="adminMobileNumber"
                                name="adminMobileNumber"
                                type="text"
                                value={formik.values.adminMobileNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="input"
                            />
                            {formik.touched.adminMobileNumber && formik.errors.adminMobileNumber && (
                                <p className="text-red-600">{formik.errors.adminMobileNumber}</p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="whatsappNumber" className="block text-sm font-medium">WhatsApp Number</label>
                            <Input
                                id="whatsappNumber"
                                name="whatsappNumber"
                                type="text"
                                value={formik.values.whatsappNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="input"
                            />
                            {formik.touched.whatsappNumber && formik.errors.whatsappNumber && (
                                <p className="text-red-600">{formik.errors.whatsappNumber}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="instagram" className="block text-sm font-medium">Instagram</label>
                        <Input
                            id="instagram"
                            name="instagram"
                            type="text"
                            value={formik.values.instagram}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="facebook" className="block text-sm font-medium">Facebook</label>
                        <Input
                            id="facebook"
                            name="facebook"
                            type="text"
                            value={formik.values.facebook}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input"
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <label htmlFor="twitter" className="block text-sm font-medium">Twitter</label>
                            <Input
                                id="twitter"
                                name="twitter"
                                type="text"
                                value={formik.values.twitter}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="input"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="linkedin" className="block text-sm font-medium">LinkedIn</label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                type="text"
                                value={formik.values.linkedin}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="input"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="btn w-full"
                        disabled={addLoading}
                    >
                        {addLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Add"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSocialMediaLink;