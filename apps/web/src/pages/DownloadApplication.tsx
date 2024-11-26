import React from "react"

import { Helmet } from "react-helmet"
import { Loading } from "@/components/Loading"
import { useState } from "react"

const DownloadApkButton: React.FC = () => {

    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        window.open("/api/storage/public/download-mobile-app", "_blank")
        setLoading(false)
    }

    return (
        <>
            <Helmet>
                <title>Descargar aplicación móvil - Dirección de personas mayores de la municipalidad de Temuco</title>
            </Helmet>

            <div className="flex w-full profile-container items-center justify-center absolute dark:shadow-none">
                <div className="bg-white dark:bg-primary-dark flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg py-12 login-form-container dark:shadow-none">

                    {loading && <Loading />}

                    <div className="w-full max-w-md flex flex-col gap-8 justify-center items-center">

                        <div className="flex flex-col gap-2 w-full">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-300 text-center mb-4">
                                Protección Mayor
                            </h2>
                            <p className="text-center text-gray-700 dark:text-neutral-300">
                                Descarga la aplicación móvil e instala en tu dispositivo para acceder a la plataforma.
                            </p>
                        </div>

                        <img src="/logo-pmtemuco.png" alt="Icono de proteccion mayor" className="w-48 h-48" />
                        <button
                            onClick={() => handleDownload()}
                            className="bg-primary text-neutral-100 rounded-lg px-4 py-2 w-2/3 h-12 font-bold"
                        >
                            Descargar
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default DownloadApkButton
