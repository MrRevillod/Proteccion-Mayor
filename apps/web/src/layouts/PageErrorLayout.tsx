import React from "react"
import "../main.css"

interface renderPageErrorProps {
	title: string
}

const RenderPageError: React.FC<renderPageErrorProps> = ({ title }) => {
	return (
		<div className="screen-container flex items-center justify-center flex-col gap-8">
			<h1 className="font-semibold text-5xl text-green-700">{title}</h1>
			<h2>Dirección de adultos mayores de la municipalidad de Temuco</h2>
		</div>
	)
}

export default RenderPageError
