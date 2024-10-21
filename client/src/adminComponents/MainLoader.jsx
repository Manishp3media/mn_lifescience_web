import React from "react";

const MainLoader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <img
                src="/logo.png"
                alt="Logo Loader"
                className="w-[150px] h-[150px] animate-[pulse_0.8s_ease-in-out_infinite]"
            />
        </div>
    );
};

export default MainLoader;
