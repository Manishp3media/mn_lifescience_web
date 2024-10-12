import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus} from "lucide-react";
import AddBanner from "./AddBanner";
import AddSocialMediaLink from "./AddSoicalMediaLink";

const AdminOptionsNavbar = () => {
    const [isBannerModalOpen, setBannerModalOpen] = useState(false);
    const [isOpenSocialModal, setOpenSocialModal] = useState(false);

    const handleOpenSocialModal = () => {
        setOpenSocialModal(true);
    };

      const handleOpenBannerModal = () => {
        console.log("Opening Add Banner modal");
        setBannerModalOpen(true);
    };

    const handleCloseBannerModal = () => {
        console.log("Closing Add Banner modal");
        setBannerModalOpen(false);
    };
    return (
        <div>
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
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
                        <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleOpenBannerModal}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Banner
                        </Button>
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
        </div>
    );
};

export default AdminOptionsNavbar;