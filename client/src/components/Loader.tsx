import React from "react";

type LoaderProps = {
    size?: "sm" | "md" | "lg" | "xl";
    fullScreen?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ size = "md", fullScreen = true }) => {
    const sizeMap = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-4",
        xl: "h-16 w-16 border-4"
    };

    const containerClass = fullScreen
        ? "fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50"
        : "flex items-center justify-center";

    return (
        <div className={containerClass}>
            <div
                className={`animate-spin rounded-full border-t-transparent border-solid border-blue-600 ${sizeMap[size]}`}
            />
        </div>
    );
};

export default Loader;
