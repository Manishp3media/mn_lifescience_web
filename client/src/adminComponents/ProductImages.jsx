import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 as Delete, Plus } from "lucide-react";
import CustomSpinner from "./CustomSpinner";

const ProductImagesPopup = ({ images, onDeleteImage, onAddImages, isLoading }) => {
    const [showAddImages, setShowAddImages] = useState(false);
    const [localImages, setLocalImages] = useState(images || []);

    // Update local state when props change
    useEffect(() => {
        console.log('Images prop updated:', images);
        setLocalImages(images || []);
    }, [images]);

    useEffect(() => {
        console.log('ProductImagesPopup rendered:', { localImages, isLoading });
    }, [localImages, isLoading]);

    const handleAddImages = async (files) => {
        console.log('ProductImagesPopup: handleAddImages called with files:', files);
        try {
            await onAddImages(files);
            console.log('ProductImagesPopup: Images added successfully');
            // No need to manually update localImages here as it will be updated through props
        } catch (error) {
            console.error('ProductImagesPopup: Error adding images:', error);
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
                            {isLoading ? (
                                <CustomSpinner />
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Images
                                </>
                            )}
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

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        console.log('AddImagesDialog: Files selected:', files.length);

        setSelectedFiles((prevFiles) => {
            const newFiles = [...prevFiles, ...files].slice(0, maxImages);
            console.log('AddImagesDialog: Updated selected files:', newFiles.length);
            return Array.from(new Set(newFiles));
        });
    };

    const handleSubmit = () => {
        console.log('AddImagesDialog: Submitting files:', selectedFiles.length);
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