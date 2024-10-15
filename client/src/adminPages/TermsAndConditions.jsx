import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerms, updateTerms } from "@/redux/termsSlice";
import JoditEditor from 'jodit-react';

const TermsAndConditions = () => {
    const dispatch = useDispatch();
    const editor = useRef(null);
    const { content, status, error } = useSelector((state) => state.terms);
    const [termsContent, setTermsContent] = useState(content);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTerms());
        }
    }, [status, dispatch]);

    useEffect(() => {
        setTermsContent(content);
    }, [content]);

    const handleSave = () => {
        dispatch(updateTerms(termsContent));
    };

    return (
        <div className="terms-editor-container">
            <h1>Terms and Conditions</h1>
            {status === 'loading' && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {status === 'succeeded' && (
                <>
                    <JoditEditor
                        ref={editor}
                        value={termsContent}
                        tabIndex={1}
                        onBlur={newContent => setTermsContent(newContent)}
                        onChange={newContent => {}}
                    />
                    <button onClick={handleSave} className="save-btn">
                        Save
                    </button>
                </>
            )}
        </div>
    );
};

export default TermsAndConditions;
