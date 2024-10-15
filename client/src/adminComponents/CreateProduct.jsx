import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createProduct } from "@/redux/productSlice";
import { fetchCategories } from "@/redux/categorySlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import CustomSpinner from "./CustomSpinner";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB in bytes

const CreateProduct = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categoryList);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sizeWarning, setSizeWarning] = useState("");
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const compressImage = useCallback(async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scaleFactor = 0.7;
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }, 'image/jpeg', 0.8);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const files = Array.from(e.currentTarget.files);
    const newImages = [];
    let totalSize = selectedImages.reduce((sum, img) => sum + img.file.size, 0);
    let warnings = [];


    // Supported file types
    const supportedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];


    for (let file of files) {
       // Check file type
    if (!supportedFormats.includes(file.type)) {
      toast.error(`${file.name} is not a supported format. Please upload jpg, png, jpeg, or webp.`);
      continue;
    }

      // if (file.size > MAX_FILE_SIZE) {
      //   toast.error(`${file.name} exceeds 3 MB, Please upload a smaller image`);
      // }
      totalSize += file.size;
      const preview = URL.createObjectURL(file);
      newImages.push({ file, preview });
    }

    if (totalSize > MAX_FILE_SIZE) {
      toast.error("Total image size exceeds 3 MB, Please upload a smaller image");
    }

    setSelectedImages(prevImages => [...prevImages, ...newImages]);
    setSizeWarning(warnings.length > 0 ? warnings.join(". ") : "");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedImages]);

  const removeImage = (index) => {
    setSelectedImages(prevImages => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    updateSizeWarning();
  };

  const updateSizeWarning = () => {
    let totalSize = selectedImages.reduce((sum, img) => sum + img.file.size, 0);
    let warnings = [];

    selectedImages.forEach(img => {
      if (img.file.size > MAX_FILE_SIZE) {
        toast.warning(`${img.file.name} exceeds 3 MB`);
      }
    });

    if (totalSize > MAX_FILE_SIZE) {
      toast.warning("Total image size exceeds 3 MB");
    }

    setSizeWarning(warnings.length > 0 ? warnings.join(". ") : "");
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      composition: "",
      sku: "",
      category: "",
      use: "",
      tags: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      composition: Yup.string().required("Composition is required"),
      sku: Yup.string().required("SKU is required"),
      use: Yup.string().required("Use is required"),
      category: Yup.string().required("Please select a category"),
      tags: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      if (sizeWarning) {
        toast.error("Please address the image size warnings before submitting.");
        return;
      }

      if (selectedImages.length === 0) {
        toast.error("Please select at least one image.");
        return;
      }

      setIsCreating(true);
      const data = new FormData();
      for (const key in values) {
        if (key === "tags") {
          data.append(key, values[key].split(",").map(tag => tag.trim()));
        } else {
          data.append(key, values[key]);
        }
      }

      selectedImages.forEach((img, index) => {
        data.append(`productImages`, img.file);
      });

      try {
        await dispatch(createProduct(data)).unwrap();
        toast.success("Product created successfully");
        formik.resetForm();
        setSelectedImages([]);
        setSizeWarning("");
      } catch (error) {
        const errorMessage = error || "Failed to create product";
        if (errorMessage === "SKU already exists") {
          toast.error("SKU already exists. Please use a different one");
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsCreating(false);
        onClose();
      }
    },
  });

  const handleCategorySelect = (category) => {
    formik.setFieldValue("category", category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        formik.resetForm();
        setSelectedImages([]);
        setSizeWarning("");
        onClose();
      }
    }} className="max-w-4xl">
      <DialogContent className="text-color-[#386D62] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create New Product</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-6 md:space-y-0"
        >
          <div>
            <label className="block text-lg mb-2">Product Name</label>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter product name"
              required
              className="w-full p-3 text-base"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <label className="block text-lg mb-2">Select Category</label>
            <DropdownMenu >
              <DropdownMenuTrigger asChild className="w-full">
                <Button variant="outline">
                  {formik?.values?.category || "Select Category"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories?.map((category) => (
                  <DropdownMenuItem
                    key={category._id}
                    onClick={() => handleCategorySelect(category?.name)}
                  >
                    {category?.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500">{formik.errors.category}</div>
            )}
          </div>

          <div>
            <label className="block text-lg mb-2">Description</label>
            <Input
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter product description"
              required
              className="w-full p-3 text-base"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500">{formik.errors.description}</div>
            )}
          </div>

          <div>
            <label className="block text-lg mb-2">Composition</label>
            <Input
              name="composition"
              value={formik.values.composition}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter composition"
              required
              className="w-full p-3 text-base"
            />
            {formik.touched.composition && formik.errors.composition && (
              <div className="text-red-500">{formik.errors.composition}</div>
            )}
          </div>

          <div>
            <label className="block text-lg mb-2">SKU</label>
            <Input
              name="sku"
              value={formik.values.sku}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter SKU"
              required
              className="w-full p-3 text-base"
            />
            {formik.touched.sku && formik.errors.sku && (
              <div className="text-red-500">{formik.errors.sku}</div>
            )}
          </div>

          <div>
            <label className="block text-lg mb-2">Use</label>
            <Input
              name="use"
              value={formik.values.use}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter product use"
              required
              className="w-full p-3 text-base"
            />
            {formik.touched.use && formik.errors.use && (
              <div className="text-red-500">{formik.errors.use}</div>
            )}
          </div>

          <div>
            <label className="block text-lg mb-2">Tags</label>
            <Input
              name="tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter tags"
              className="w-full p-3 text-base"
            />
            {formik.touched.tags && formik.errors.tags && (
              <div className="text-red-500">{formik.errors.tags}</div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-lg mb-">Product Images</label>
            <Input
              type="file"
              name="productImages"
              onChange={handleFileChange}
              multiple
              className="input mb-2"
              ref={fileInputRef}
            />
            {sizeWarning && (
              <div className="text-yellow-500 mb-2">Warning: {sizeWarning}</div>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img.preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="col-span-2">
            <Button
              type="submit"
              className="bg-[#386D62] hover:bg-[#386D62] text-white px-4 py-2"
              disabled={isCreating || sizeWarning !== ""}
            >
              {isCreating ? <CustomSpinner size={20} /> : "Create"}
            </Button>
            <Button
              className="hover:bg-red-500"
              onClick={() => {
                formik.resetForm();
                setSelectedImages([]);
                setSizeWarning("");
                onClose();
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
