import React, { useState } from 'react';
import JoditEditor from 'jodit-react';

const TermsAndConditions = () => {
    const [content, setContent] = useState('');

    const config = {
        // Add your configuration options here
        toolbar: [
            'bold',
            'italic',
            'underline',
            '|',
            'ul',
            'ol',
            '|',
            'image',
            'table',
            '|',
            'link',
            'align',
            'undo',
            'redo',
        ],
        // Other config options can be added here
    };

    return (
        <div>
            <JoditEditor
                value={content}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onChange={(newContent) => setContent(newContent)}
            />
        </div>
    );
};

export default TermsAndConditions;
