import React from "react"

import "../main.css"

const NotFoundPage: React.FC = () => {
	return (
		<div className="screen-container flex items-center justify-center flex-col gap-8">
			<h1 className="font-semibold text-5xl text-green-700">404 - Página no encontrada</h1>
			<h2>Dirección de adultos mayores de la municipalidad de Temuco</h2>
		</div>
	)
}

export default NotFoundPage
