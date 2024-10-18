import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerms, updateTerms } from "@/redux/termsSlice";
import JoditEditor from 'jodit-react';
import UsersAndTersmsNavbar from "@/adminComponents/UsersNavbar";

const TermsAndConditions = () => {
    const dispatch = useDispatch();
    const editor = useRef(null);
    const { content, loading } = useSelector((state) => state.terms);
    const [termsContent, setTermsContent] = useState(content);
    const [termsLoading, setTermsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchTerms());
    }, [dispatch]);

    useEffect(() => {
        setTermsContent(content);
    }, [content]);

    const handleSave = () => {
        dispatch(updateTerms(termsContent));
    };

    
    return (
        <div>
            <UsersAndTersmsNavbar title="Terms and Conditions" />
       
        <div className="min-h-screen bg-gray-100 p-6">
            
            <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
            {loading ? (
                        <div>Loading terms...</div>
                    ) : (
          
                <>
                 <div className="mb-4">
                    <JoditEditor
                        ref={editor}
                        value={termsContent}
                       
                        tabIndex={1}
                        onBlur={newContent => setTermsContent(newContent)}
                        onChange={newContent => {}}
                    />
                    </div>
                    <div className="text-right">
                    <button onClick={handleSave} 
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Save
                    </button>
                    </div>
                </>
            )}
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