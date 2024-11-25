import React from "react";

const DownloadApkButton: React.FC = () => {
    const downloadApk = () => {
        window.location.href = "http://localhost/api/dashboard/storage/downloadapk";
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <button
                onClick={downloadApk}
                className="bg-green-800 text-neutral-100 rounded-lg p-2 w-64 h-12 font-bold"
            >
                Descargar APK
            </button>
        </div>
    );
};

export default DownloadApkButton;
