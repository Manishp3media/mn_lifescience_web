import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bulkUploadProducts } from "@/redux/productSlice";
import {Button} from "@/components/ui/button";
import { toast } from "react-toastify";
import CustomSpinner from "./CustomSpinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ProductBulkUploadDialog = ({ isBulkOpen, onBulkClose }) => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const bulkUploadStatus = useSelector((state) => state.productList.bulkUploadStatus);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkUpload = () => {
    if (file) {
      dispatch(bulkUploadProducts(file))
        .unwrap()
        .then(() => {
          toast.success("Bulk upload successful!");
          onBulkClose(); // Close dialog on success
        })
        .catch((error) => {
          toast.error(error || "Bulk upload failed");
        });
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
          <Button onClick={handleBulkUpload} disabled={bulkUploadStatus === "loading"}>
            {bulkUploadStatus === "loading" ? <CustomSpinner /> : "Upload Excel"}
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
