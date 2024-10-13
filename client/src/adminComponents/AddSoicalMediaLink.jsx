import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import CustomSpinner from "./CustomSpinner";
import { useDispatch } from "react-redux";
import { addSocialMediaLink } from "@/redux/socialMediaSlice";

function AddSocialMediaLink({ isSocialMediaLinkOpen, onSocialMediaLinkClose }) {
    const dispatch = useDispatch();
    const [isCreating, setIsCreating] = useState(false);
    const formik = useFormik({
        initialValues: {
            platform: '',
            url: '',
        },
        validationSchema: Yup.object({
            platform: Yup.string().required('Platform is required'),
            url: Yup.string().required('URL is required'),
        }),
        onSubmit: async (values) => {
            setIsCreating(true);
            try {
                await dispatch(addSocialMediaLink(values)).unwrap();
                toast.success("Product created successfully");
                formik.resetForm();
            } catch (error) {
                // The error message is now directly in the error object
                const errorMessage = error || 'Failed to add social media link';

                if (errorMessage === "Social media link for platform already exists") {
                    toast.error("A social media link for this platform already exists.");
                } else {
                    toast.error(errorMessage);
                }
            } finally {
                setIsCreating(false);
                onSocialMediaLinkClose();
            }
        }

    });

    return (
        <Dialog open={isSocialMediaLinkOpen} onOpenChange={onSocialMediaLinkClose}>
            <DialogContent className="text-color-[#386D62]">
                <DialogHeader>
                    <DialogTitle>Add New Social Media Link</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Platform</label>
                        <Input
                            name="platform"
                            value={formik.values.platform}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter category platform"
                            required
                        />
                        {formik.touched.platform && formik.errors.platform && (
                            <div className="text-red-500">{formik.errors.platform}</div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">URL/Number</label>
                        <Input
                            name="url"
                            value={formik.values.url}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter category url"
                            required
                        />
                        {formik.touched.url && formik.errors.url && (
                            <div className="text-red-500">{formik.errors.url}</div>
                        )}
                    </div>


                    <DialogFooter>
                        <Button type="submit" className="bg-[#386D62] hover:bg-[#386D62]" disabled={isCreating}>
                            {isCreating ? <CustomSpinner size={20} /> : "Add"}
                        </Button>
                        <Button className="hover:bg-red-500" onClick={onSocialMediaLinkClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddSocialMediaLink;
