import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerms, updateTerms } from "@/redux/termsSlice";
import JoditEditor from 'jodit-react';
import UsersAndTersmsNavbar from "@/adminComponents/UsersNavbar";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const TermsAndConditions = () => {
    const dispatch = useDispatch();
    const editor = useRef(null);
    const { content } = useSelector((state) => state.terms);
    const [termsContent, setTermsContent] = useState(content);
    const [termsLoading, setTermsLoading] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);

    // useEffect(() => {
    //     dispatch(fetchTerms());
    // }, [dispatch]);
    
    useEffect(() => {
        const loadTerms = async () => {
            if (loadingTerms) return; // Prevent multiple calls
            setLoadingTerms(true); // Set loading to true before fetching
    
            try {
                await dispatch(fetchTerms());
            } catch (error) {
                console.error("Failed to fetch enquiries:", error);
                // Optionally, you can set an error state here
            } finally {
                setLoadingTerms(false); // Always set loading to false after fetching
            }
        };
        
        loadTerms();
    }, [dispatch]); // Add loading as a dependency if needed

    useEffect(() => {
        setTermsContent(content);
    }, [content]);

    const handleSave = async () => {
        try {
            setTermsLoading(true);
            await dispatch(updateTerms(termsContent)).unwrap();
            toast.success('Terms and Conditions updated successfully');
        } catch (err) {
            toast.error('Failed to update Terms and Conditions');
        } finally {
            setTermsLoading(false);
        }
    };

    if (loadingTerms) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin w-[60px] h-[200px]" />
            </div>
        );
    }
    
    return (
        <div>
            <UsersAndTersmsNavbar title="Terms and Conditions" />
       
        <div className="min-h-screen bg-gray-100 p-6">
            
            <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
           
          
                <>
                 <div className="mb-4">
                    <JoditEditor
                        ref={editor}
                        value={termsContent}
                        config={{
                            placeholder: "" // Set the placeholder to an empty string
                        }}
                        tabIndex={1}
                        onBlur={newContent => setTermsContent(newContent)}
                        onChange={newContent => {}}
                    />
                    </div>
                    <div className="text-right">
                    <button onClick={handleSave} 
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        {termsLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save"}
                    </button>
                    </div>
                </>
      
            </div>
        </div>
        </div>
    );
};

export default TermsAndConditions;


// const editorConfig = {
    //     buttons: [
    //         'bold', 'italic', 'underline', 'strikethrough', 
    //         'align', 'undo', 'redo', 'ul', 'ol', 'outdent', 'indent', 'font', 'fontsize', 'brush', 'link'
    //     ],
    //     toolbarSticky: false,
    //     showXPathInStatusbar: false,
    //     askBeforePasteHTML: false,
    //     askBeforePasteFromWord: false,
    //     defaultActionOnPaste: 'insert_only_text',
    // };

     // config={editorConfig}