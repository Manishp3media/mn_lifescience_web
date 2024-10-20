import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 as Delete, Plus } from "lucide-react";
import CustomSpinner from "./CustomSpinner";
import { MAX_FILE_SIZE, supportedFormats } from "@/constant/constant";
import { toast } from "react-toastify";

const ProductImagesPopup = ({ images, onDeleteImage, onAddImages, isLoading }) => {
    const [showAddImages, setShowAddImages] = useState(false);
    const [localImages, setLocalImages] = useState(images || []);

    // Update local state when props change
    useEffect(() => {
        setLocalImages(images || []);
    }, [images]);

    const handleAddImages = async (files) => {
        try {
            await onAddImages(files);
            // No need to manually update localImages here as it will be updated through props
        } catch (error) {
            toast.error(error);
        }
        setShowAddImages(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Images ({localImages.length})</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Product Images ({localImages.length}/10)</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {localImages.map((image) => (
                        <Card key={image._id} className="relative overflow-hidden">
                            <CardContent className="p-2">
                                <img
                                    src={image.url}
                                    alt="Product"
                                    className="w-full h-48 object-cover rounded-md"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                        console.log('Deleting image:', image._id);
                                        onDeleteImage(image._id);
                                    }}
                                >
                                    <Delete className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {localImages.length < 10 && (
                        <Button
                            onClick={() => {
                                console.log('Opening AddImagesDialog');
                                setShowAddImages(true);
                            }}
                            className="mt-4"
                        >
                            Add Images
                        </Button>
                    )}
                </div>
            </DialogContent>
            {showAddImages && (
                <AddImagesDialog
                    onClose={() => {
                        console.log('Closing AddImagesDialog');
                        setShowAddImages(false);
                    }}
                    onAddImages={handleAddImages}
                    maxImages={10 - localImages.length}
                    isLoading={isLoading}
                />
            )}
        </Dialog>
    );
};

const AddImagesDialog = ({ onClose, onAddImages, maxImages, isLoading }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageError, setImageError] = useState("");

    const handleFileChange = (event) => {
         // Reset the size warning whenever file input changes
         setImageError("");

        const files = Array.from(event.target.files);

        for (let file of files) {
            if (file.size > MAX_FILE_SIZE) {
                setImageError(`${file.name} exceeds the 5 MB size limit. Please upload image of size less than 5 mb`);
                return;
            }

            if (!supportedFormats.includes(file.type)) {
                setImageError(`${file.name} is not a supported format. Please upload jpg, png, jpeg, or webp.`);
                return; // Early return if format is not supported
            }
        }

        setSelectedFiles((prevFiles) => {
            const newFiles = [...prevFiles, ...files].slice(0, maxImages);
            return Array.from(new Set(newFiles));
        });
    };

    const handleSubmit = () => {
        onAddImages(selectedFiles);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Images (Max: {maxImages})</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mb-4"
                    />
                    <div className="grid grid-cols-3 gap-2">
                        {selectedFiles.map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover"
                            />
                        ))}
                        
                    </div>
                    {imageError && <div className="text-red-500">{imageError}</div>}
                    <Button
                        onClick={handleSubmit}
                        disabled={selectedFiles.length === 0 || isLoading}
                    >
                        {isLoading ? (
                            <CustomSpinner />
                        ) : (
                            <>
                                Add {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductImagesPopup;