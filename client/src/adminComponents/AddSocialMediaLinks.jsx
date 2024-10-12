import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import CustomSpinner from "@/adminComponents/CustomSpinner";
import { toast } from "react-toastify";
import { addSocialMediaLinks } from "@/redux/adminOptionsSlice";
import { Facebook, Twitter, Instagram, LinkedIn, WhatsApp, YouTube } from "lucide-react";

const AddSocialMediaLinks = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    
    // Formik with initial values and Yup validation schema
    const formik = useFormik({
        initialValues: {
            platform: "",
            url: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("name is required"),
            url: Yup.string().required("URL is required"),
        }),
        onSubmit: async (values) => {
            setIsCreating(true);
            const data = { ...values };
      
            try {
              await dispatch(addSocialMediaLinks(data)).unwrap();
              toast.success("Product created successfully");
              formik.resetForm();
            } catch (error) {
                if (error.response && error.response.status === 400 && error.response.data.message.includes('Category already exists')) {
                    formik.setFieldError("name", "Category already exists. Please use a different one.");
                } else {
                    toast.error("Failed to create category");
                }
                console.error("Error creating category:", error);
            } finally {
              setIsCreating(false);
              onClose();
            }
          },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="text-color-[#386D62]">
                <DialogHeader>
                    <DialogTitle>Add New Social Media Link</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Product Name</label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter category name"
                            required
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500">{formik.errors.name}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-[#386D62] hover:bg-[#386D62]" disabled={isCreating}>
                            {isCreating ? <CustomSpinner size={20} /> : "Create"}
                        </Button>
                        <Button className="hover:bg-red-500" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSocialMediaLinks;