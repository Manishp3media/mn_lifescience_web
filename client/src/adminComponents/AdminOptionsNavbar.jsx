import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus} from "lucide-react";
import AddBanner from "./AddBanner";
import AddSocialMediaLink from "./AddSoicalMediaLink";
import AddLogo from "./AddLogo";
import { getLogo } from "@/redux/logoSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminOptionsNavbar = () => {
    const dispatch = useDispatch();
    const [isBannerModalOpen, setBannerModalOpen] = useState(false);
    const [isOpenSocialModal, setOpenSocialModal] = useState(false);
    const [isOpenLogoModal, setOpenLogoModal] = useState(false);
    const { logo } = useSelector((state) => state.logo); 

    useEffect(() => {
        dispatch(getLogo());
    }, [dispatch]);

    const handleOpenSocialModal = () => {
        setOpenSocialModal(true);
    };

      const handleOpenBannerModal = () => {
        setBannerModalOpen(true);
    };

    const handleCloseBannerModal = () => {
        setBannerModalOpen(false);
    };

    const handleLogoModal = () => {
        setOpenLogoModal(true);
    };

    return (
        <div>
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">Admin Options</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="max-w-lg w-full lg:max-w-xs">
                           
                           
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* AddBanner modal */}
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleOpenBannerModal}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Banner
                        </Button>

                        {/* AddLogo modal */}
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleLogoModal}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            {logo[0]?.logoImage ? "Update Logo" : "Add Logo"}
                        </Button>

                        {/* AddSocialMediaLink modal */}
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleOpenSocialModal}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Social Media Links
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
         {/* AddBanner modal */}
         {isBannerModalOpen && (
            <AddBanner isOpen={isBannerModalOpen} onClose={handleCloseBannerModal} />
        )}

        {/* AddSocialMediaLink modal */}
        {isOpenSocialModal && (
            <AddSocialMediaLink
                isSocialMediaLinkOpen={isOpenSocialModal}
                onSocialMediaLinkClose={() => setOpenSocialModal(false)}
            />
        )}

        {/* AddLogo modal */}
        <AddLogo isAddLogoOpen={isOpenLogoModal} onLogoClose={() => setOpenLogoModal(false)} />
        </div>
    );
};

export default AdminOptionsNavbar;