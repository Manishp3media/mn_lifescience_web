import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const CustomSpinner = ({ size = 24 }) => {
    return (
        <CircularProgress 
            size={size} 
            sx={{ color: "white" }} // Custom color
        />
    );
};

export default CustomSpinner;