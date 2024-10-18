import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulkUploadProducts, fetchProducts } from "@/redux/productSlice";
import {Button} from "@/components/ui/button";
import { toast } from "react-toastify";
import CustomSpinner from "./CustomSpinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ProductBulkUploadDialog = ({ isBulkOpen, onBulkClose }) => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      const resultAction = await dispatch(bulkUploadProducts(file));
      if (bulkUploadProducts.fulfilled.match(resultAction)) {
        // Fetch updated products list
        await dispatch(fetchProducts());
        toast.success("Bulk upload successful!");
        setFile(null);
        onBulkClose();
      } else if (bulkUploadProducts.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Bulk upload failed");
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    }
  };


  return (
    <Dialog open={isBulkOpen} onOpenChange={onBulkClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="border p-2 w-full"
          />
          <Button onClick={handleBulkUpload}  disabled={isUploading || !file}>
          {isUploading ? <CustomSpinner /> : "Upload Excel"}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onBulkClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductBulkUploadDialog;
