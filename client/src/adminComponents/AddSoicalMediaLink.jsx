import React from "react";
import { useDispatch } from "react-redux";
import { addSocialMediaLink } from "@/redux/socialMediaSlice";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Adjust the import path as needed
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input"; // shadcn Input component
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const AddSocialMediaLink = ({ isSocialMediaLinkOpen, onSocialMediaLinkClose }) => {
    const dispatch = useDispatch();

    // Formik setup
    const formik = useFormik({
        initialValues: {
            adminEmail: "",
            adminMobileNumber: "",
            whatsappNumber: "",
            instagram: "",
            facebook: "",
            twitter: "",
            linkedin: "",
            // platform: "",
            // link: "",
        },
        validationSchema: Yup.object({
            adminEmail: Yup.string().email("Invalid email format").optional(),
            adminMobileNumber: Yup.string().length(10, "Mobile Number must be exactly 10 digits").optional(),
            whatsappNumber: Yup.string().length(10, "Mobile Number must be exactly 10 digits").optional(),
            instagram: Yup.string().optional(),
            facebook: Yup.string().optional(),
            twitter: Yup.string().optional(),
            linkedin: Yup.string().optional(),
            // platform: Yup.string().optional(),
            // link: Yup.string().optional(),
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
                toast.error(error || "Failed to add social media link");
                console.error("Error:", error);
            } finally {
                onSocialMediaLinkClose();
            }
        },
    });

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

                    {/* Two fields in one row */}
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

                    {/* <Accordion type="single" collapsible className="mb-4">
                        <AccordionItem value="platform">
                            <AccordionTrigger>Add More</AccordionTrigger>
                            <AccordionContent>
                                <div className="mb-4">
                                    <label htmlFor="platform" className="block text-sm font-medium">Platform</label>
                                    <Input
                                        id="platform"
                                        name="platform"
                                        type="text"
                                        value={formik.values.platform}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="input"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="link" className="block text-sm font-medium">Link</label>
                                    <Input
                                        id="url"
                                        name="url"
                                        type="text"
                                        value={formik.values.url}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="input"
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion> */}

                    <Button type="submit" className="btn">
                        Add
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    );
};

export default AddSocialMediaLink;
