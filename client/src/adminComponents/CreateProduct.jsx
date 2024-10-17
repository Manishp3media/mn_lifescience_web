import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createProduct } from "@/redux/productSlice";
import { fetchCategories } from "@/redux/categorySlice";
import JoditEditor from 'jodit-react';
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UsersAndTersmsNavbar from "./UsersNavbar";
import { Input } from "@/components/ui/input";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categoryList);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sizeWarning, setSizeWarning] = useState("");
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategorySelect = (category) => {
    formik.setFieldValue("category", category);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.currentTarget.files);
    const newImages = [];
    let totalSize = selectedImages.reduce((sum, img) => sum + img.file.size, 0);
    let warnings = [];

    const supportedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    for (let file of files) {
      if (!supportedFormats.includes(file.type)) {
        toast.error(`${file.name} is not a supported format. Please upload jpg, png, jpeg, or webp.`);
        continue;
      }

      totalSize += file.size;
      const preview = URL.createObjectURL(file);
      newImages.push({ file, preview });
    }

    if (totalSize > MAX_FILE_SIZE) {
      toast.error("Total image size exceeds 3 MB. Please upload smaller images.");
    }

    setSelectedImages(prevImages => [...prevImages, ...newImages]);
    setSizeWarning(warnings.length > 0 ? warnings.join(". ") : "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prevImages => {
      const newImages = [...prevImages];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      composition: "",
      sku: "",
      category: "",
      tags: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      composition: Yup.string().required("Composition is required"),
      sku: Yup.string().required("SKU is required"),
      category: Yup.string().required("Please select a category"),
      tags: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      if (sizeWarning) {
        toast.error("Please address the image size warnings before submitting.");
        return;
      }

      if (!thumbnailImage) {
        toast.error("Please upload a thumbnail image.");
        return;
      }

      // if (selectedImages.length === 0) {
      //   toast.error("Please select at least one image.");
      //   return;
      // }

      setIsCreating(true);
      const data = new FormData();
      for (const key in values) {
        if (key === "tags") {
          data.append(key, values[key].split(",").map(tag => tag.trim()));
        } else {
          data.append(key, values[key]);
        }
      }

      // Append thumbnail image
      data.append("thumbnailImage", thumbnailImage.file);

      selectedImages.forEach((img) => {
        data.append(`productImages`, img.file);
      });

      try {
        await dispatch(createProduct(data)).unwrap();
        toast.success("Product created successfully");
        formik.resetForm();
        setSelectedImages([]);
        setThumbnailImage(null);
        setSizeWarning("");
      } catch (error) {
        const errorMessage = error?.message || "Failed to create product";
        toast.error(errorMessage);
      } finally {
        setIsCreating(false);
      }
    },
  });

  // Text Editor Config
  const descriptionEditorRef = useRef(null);
  const compositionEditorRef = useRef(null);

  const descriptionConfig = useMemo(() => ({
    readonly: false,
    height: 300,
    width: '100%',
    placeholder: 'Start typing...',
    toolbarButtonSize: 'small',
    buttons: [
      'undo', 'redo', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'ul', 'ol', '|',
      'align', 'outdent', 'indent', '|',
      'link', 'image', 'table', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    removeButtons: ['file', 'video'],
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
  }), []);

  const compositionConfig = useMemo(() => ({
    readonly: false,
    height: 300,
    width: '100%',
    placeholder: 'Start typing...',
    toolbarButtonSize: 'small',
    buttons: [
      'undo', 'redo', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'ul', 'ol', '|',
      'align', 'outdent', 'indent', '|',
      'link', 'image', 'table', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    removeButtons: ['file', 'video'],
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
  }), []);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
      setThumbnailImage({ file, preview: URL.createObjectURL(file) });
    } else {
      toast.error("Unsupported format. Please upload jpg, png, jpeg, or webp.");
    }

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };


  return (
    <div className="bg-gray-100">
    <UsersAndTersmsNavbar title="Create Product" />
  
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-x-6">
          {/* Product Name */}
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 pb-2">Product Name</label>
              <Input
                type="text"
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 mt-1 text-sm">{formik.errors.name}</div>
              )}
            </div>
          </div>
  
          {/* Thumbnail Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 pb-2">Thumbnail Image</label>
            <input
              type="file"
              onChange={handleThumbnailChange}
              className="mt-1 block w-full"
              ref={thumbnailInputRef}
            />
            {thumbnailImage && (
              <div className="mt-2 relative">
                <img src={thumbnailImage.preview} alt="Thumbnail Preview" className="w-20 h-20 object-cover" />
                <button
                  type="button"
                  onClick={() => setThumbnailImage(null)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
  
          {/* SKU */}
          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 pb-2">SKU</label>
              <Input
                type="text"
                id="sku"
                name="sku"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sku}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
              />
              {formik.touched.sku && formik.errors.sku && (
                <div className="text-red-500 mt-1 text-sm">{formik.errors.sku}</div>
              )}
            </div>
          </div>
  
          {/* Category Selection */}
          <div className="col-span-2 md:col-span-1 mt-4">
            <label className="block text-sm font-medium text-gray-700 pb-2">Category</label>
            <DropdownMenu>
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
        </div>
  
        <div className="flex flex-col items-center">
        <div className="max-w-4xl w-full ">
            <label className="block text-sm font-medium text-gray-700 pb-2">Description</label>
            <JoditEditor
              ref={descriptionEditorRef}
              value={formik.values.description}
              config={descriptionConfig}
              tabIndex={1}
              onBlur={(newContent) => formik.setFieldValue('description', newContent)}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 mt-1">{formik.errors.description}</div>
            )}
          </div>
  
          {/* Composition */}
          <div className="max-w-4xl w-full mt-6">
            <label className="block text-sm font-medium text-gray-700 pb-2">Composition</label>
            <JoditEditor
              ref={compositionEditorRef}
              value={formik.values.composition}
              config={compositionConfig}
              tabIndex={2}
              onBlur={(newContent) => formik.setFieldValue('composition', newContent)}
            />
            {formik.touched.composition && formik.errors.composition && (
              <div className="text-red-500 mt-1">{formik.errors.composition}</div>
            )}
          </div>
        </div>
  
        {/* Tags */}
        <div className="grid grid-cols-2 gap-x-6 mt-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 pb-2">Tags</label>
            <Input
              type="text"
              id="tags"
              name="tags"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tags}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {formik.touched.tags && formik.errors.tags && (
              <div className="text-red-500 mt-1">{formik.errors.tags}</div>
            )}
          </div>
  
          {/* Product Images */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 pb-2">Product Images</label>
            <Input
              type="file"
              onChange={handleFileChange}
              multiple
              className="mt-1 block w-full"
              ref={fileInputRef}
            />
            {sizeWarning && (
              <div className="text-yellow-500 mt-1">Warning: {sizeWarning}</div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
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
        </div>
  
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default CreateProduct;

{/* <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 mt-1">{formik.errors.category}</div>
          )}
        </div> */}

//   <div>
//   <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//   <JoditEditor
//     ref={null}
//     value={formik.values.description}
//     config={editorConfig}
//     tabIndex={1}
//     onBlur={(newContent) => formik.setFieldValue('description', newContent)}
//   />
//   {formik.touched.description && formik.errors.description && (
//     <div className="text-red-500 mt-1">{formik.errors.description}</div>
//   )}
// </div>

// <div>
//   <label htmlFor="composition" className="block text-sm font-medium text-gray-700">Composition</label>
//   <JoditEditor
//     ref={null}
//     value={formik.values.composition}
//     config={editorConfig}
//     tabIndex={2}
//     onBlur={(newContent) => formik.setFieldValue('composition', newContent)}
//   />
//   {formik.touched.composition && formik.errors.composition && (
//     <div className="text-red-500 mt-1">{formik.errors.composition}</div>
//   )}
// </div>