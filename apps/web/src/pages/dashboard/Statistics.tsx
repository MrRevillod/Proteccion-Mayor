import React, { useEffect, useState } from "react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, LineChart, Tooltip, Legend } from "recharts"
import PageLayout from "../../layouts/PageLayout"
import { api } from "../../lib/axios" // Asegúrate de importar tu API

interface AsisenciData {
	asistencia: any[]
	inasistencia: any[]
}

const StatisticsPage: React.FC = () => {
	const [asistencia, setAsistencia] = useState<any[]>([])
	const [inasistencia, setInasistencia] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get("/dashboard/reports/concurrencia")
				const data: AsisenciData = response.data.values // Asegúrate de acceder correctamente a los datos

				console.log("Asistencia data: ", data.asistencia)
				console.log("Inasistencia data: ", data.inasistencia)

				setAsistencia(data.asistencia)
				setInasistencia(data.inasistencia)
			} catch (err: any) {
				setError(err.message || "Error desconocido")
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, []) // Se ejecuta solo una vez al montar el componente

	if (loading) return <div>Cargando datos...</div>
	if (error) return <div>Error al cargar los datos: {error}</div>

	return (
		<PageLayout pageTitle="Concurrencia de eventos y Asistencia por Centros">
			<h2>Eventos Asistidos</h2>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart data={asistencia}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line dataKey="count" stroke="green" name="Asistidos" />
				</LineChart>
			</ResponsiveContainer>

			<h2>Eventos No Asistidos</h2>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart data={inasistencia}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line dataKey="count" stroke="red" name="No Asistidos" />
				</LineChart>
			</ResponsiveContainer>
		</PageLayout>
	)
}

export default StatisticsPage
