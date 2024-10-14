import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 as Delete } from "lucide-react";

const ProductImagesPopup = ({ images, onDeleteImage }) => {
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImagesPopup;