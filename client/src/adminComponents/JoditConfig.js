import { useMemo } from "react";

import JoditEditor from 'jodit-react';

export const descriptionConfig = {
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
};

export const compositionConfig = {
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
};