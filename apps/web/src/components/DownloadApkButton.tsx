import React, { Fragment } from "react";
import { Helmet } from "react-helmet";

const DownloadApkButton: React.FC = () => {
    const downloadApk = () => {
        window.location.href = "http://localhost/api/dashboard/storage/downloadapk";
    };

    return (
        <Fragment>
            <Helmet>
                <title>Descargar APK - Dirección de personas mayores de la municipalidad de Temuco</title>
            </Helmet>

            <div className="flex w-full login-container items-center justify-center absolute dark:shadow-none">
                <div className="bg-white dark:bg-primary-dark flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg py-12 login-form-container dark:shadow-none">
                    <div className="w-full max-w-md">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-neutral-300 text-center mb-4">
                            Descargar Aplicación
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-dark mb-6">
                            Dirección de personas mayores de la municipalidad de Temuco.
                        </p>

                        <button
                            onClick={downloadApk}
                            className="bg-green-800 text-neutral-100 rounded-lg px-4 py-2 w-full h-12 font-bold"
                        >
                            Descargar APK
                        </button>

                        <img
                            src="/diseño.png"
                            alt="Icono de diseño"
                            className="mt-4 w-16 h-16 mx-auto"
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default DownloadApkButton;
