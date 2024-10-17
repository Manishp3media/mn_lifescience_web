import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSocialMediaLink } from "@/redux/socialMediaSlice";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // Adjust the import path as needed

const AddSocialMediaLink = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    // const loading = useSelector((state) => state.socialMediaLinkList.loading);
    // const error = useSelector((state) => state.socialMediaLinkList.error);

    // const [platform, setPlatform] = useState("");
    // const [url, setUrl] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminMobileNumber, setAdminMobileNumber] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [linkedin, setLinkedin] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const socialMediaLink = {
            platform,
            url,
            adminEmail,
            adminMobileNumber,
            whatsappNumber,
            instagram,
            facebook,
            twitter,
            linkedin,
        };

        await dispatch(addSocialMediaLink(socialMediaLink));
        onClose(); // Close the dialog after submitting
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="btn">Add Social Media Link</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Social Media Link</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new social media link.
                    </DialogDescription>
                </DialogHeader>
                {/* {error && <p className="text-red-600">{error}</p>} */}
                <form onSubmit={handleSubmit}>
                    {/* <div className="mb-4">
                        <label htmlFor="platform" className="block text-sm font-medium">Platform:</label>
                        <input
                            type="text"
                            id="platform"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="url" className="block text-sm font-medium">URL:</label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="input"
                        />
                    </div> */}
                    <div className="mb-4">
                        <label htmlFor="adminEmail" className="block text-sm font-medium">Admin Email:</label>
                        <input
                            type="email"
                            id="adminEmail"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="adminMobileNumber" className="block text-sm font-medium">Admin Mobile Number:</label>
                        <input
                            type="text"
                            id="adminMobileNumber"
                            value={adminMobileNumber}
                            onChange={(e) => setAdminMobileNumber(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="whatsappNumber" className="block text-sm font-medium">WhatsApp Number:</label>
                        <input
                            type="text"
                            id="whatsappNumber"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="instagram" className="block text-sm font-medium">Instagram:</label>
                        <input
                            type="text"
                            id="instagram"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="facebook" className="block text-sm font-medium">Facebook:</label>
                        <input
                            type="text"
                            id="facebook"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="twitter" className="block text-sm font-medium">Twitter:</label>
                        <input
                            type="text"
                            id="twitter"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="linkedin" className="block text-sm font-medium">LinkedIn:</label>
                        <input
                            type="text"
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="input"
                        />
                    </div>
                    <button type="submit" className="btn">
                        add
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSocialMediaLink;
