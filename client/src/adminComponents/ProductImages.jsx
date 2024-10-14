import React , { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 as Delete, Plus } from "lucide-react";

const ProductImagesPopup = ({ images, onDeleteImage, onAddImages }) => {
    const [showAddImages, setShowAddImages] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Images</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Images</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
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
                  onClick={() => onDeleteImage(image._id)}
                >
                  <Delete className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
           {images.length < 10 && (
            <Button onClick={() => setShowAddImages(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Images
            </Button>
          )}
        </div>
      </DialogContent>
        {/* Show AddImagesDialog when showAddImages is true */}
        {showAddImages && (
                <AddImagesDialog
                    onClose={() => setShowAddImages(false)} // Close the dialog when done
                    onAddImages={(files) => {
                        onAddImages(files);
                        setShowAddImages(false); // Close after adding images
                    }}
                    maxImages={10 - images.length} // Max number of images allowed
                />
            )}
    </Dialog>
  );
};

const AddImagesDialog = ({ onClose, onAddImages, maxImages }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
  
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
    
        // Append new files while ensuring not to exceed the maxImages limit
        setSelectedFiles((prevFiles) => {
          const newFiles = [...prevFiles, ...files].slice(0, maxImages); // Append new files
          // Optionally, remove duplicate files
          return Array.from(new Set(newFiles));
        });
      };
    
  
    const handleSubmit = () => {
      onAddImages(selectedFiles);
      onClose();
    };
  
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Images</DialogTitle>
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
            <Button onClick={handleSubmit} disabled={selectedFiles.length === 0}>
              Add {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

export default ProductImagesPopup;