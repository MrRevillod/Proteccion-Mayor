import React, { useEffect, useState } from "react"
import {
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Line,
	LineChart,
	Tooltip,
	Legend,
	BarChart,
	Bar,
	PieChart,
	Pie,
} from "recharts"
import PageLayout from "../../layouts/PageLayout"
import { api } from "../../lib/axios"
import { useRequest } from "@/hooks/useRequest"
import { message } from "antd"

type FormattedDateCount = {
	date: string
	count: number
}
interface StatisticsResponse {
	formattedAssistanceEvents: FormattedDateCount[]
	formattedNoAssistanceEvents: FormattedDateCount[]
}

const StatisticsPage: React.FC = () => {
	const [asistencia, setAsistencia] = useState<FormattedDateCount[]>([])
	const [inasistencia, setInasistencia] = useState<FormattedDateCount[]>([])
	const { error, loading, data } = useRequest<StatisticsResponse>({
		action: async () => await api.get("/dashboard/reports/"),
		onSuccess: (data) => {
			setAsistencia(data.formattedAssistanceEvents)
			setInasistencia(data.formattedNoAssistanceEvents)
		},
	})

	if (error) message.error("Error al cargar los datos")
	/* 	const [asistencia, setAsistencia] = useState<any[]>([])
	const [inasistencia, setInasistencia] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get("/dashboard/reports/")
				const data: AsisenciData = response.data.values

				setAsistencia(asistencia)
				setInasistencia(inasistencia)
			} catch (err: any) {
				setError(err.message || "Error desconocido")
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, []) */

	if (loading) return <div>Cargando datos...</div>
	if (error) return <div>Error al cargar los datos: {error}</div>

	return (
		<PageLayout pageTitle="Concurrencia de eventos y Asistencia por Centros">
			<div className="grid grid-cols-3 gap-4 p-4">
				<div className="bg-white p-4 shadow-md rounded-lg col-span-1">
					<h2>Total Asistidos</h2>
					<p className="text-2xl font-bold"></p>
				</div>
				<div className="bg-white p-4 shadow-md rounded-lg col-span-1">
					<h2>Total No Asistidos</h2>
					<p className="text-2xl font-bold">Falta que funcione</p>
				</div>
				<div className="bg-white p-4 shadow-md rounded-lg col-span-1">
					<h2>Promedio Diario</h2>
					<p className="text-2xl font-bold">Falta que funcione</p>
				</div>

				<div className="bg-white p-4 shadow-md rounded-lg">
					<h2>Asistencias por Día</h2>
					<ResponsiveContainer width="100%" height={200}>
						<LineChart data={asistencia}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								data={inasistencia}
								dataKey="count"
								stroke="#3498db"
								name="Asistencia"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="bg-white p-4 shadow-md rounded-lg">
					<h2>Inasistencias por Día</h2>
					<ResponsiveContainer width="100%" height={200}>
						<LineChart data={inasistencia}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="count" stroke="#e74c3c" name="Inasistencia" />
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="bg-white p-4 shadow-md rounded-lg">
					<h2>Asistencias vs Inasistencias</h2>
					<ResponsiveContainer width="100%" height={200}>
						<LineChart data={asistencia}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								data={asistencia}
								dataKey="count"
								stroke="#3498db"
								name="Asistencias"
							/>
							<Line
								type="monotone"
								data={inasistencia}
								dataKey="count"
								stroke="#e74c3c"
								name="Inasistencias"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="col-span-3 bg-white p-4 shadow-md rounded-lg">
					<h2>Tendencia General</h2>
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={asistencia}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line type="monotone" dataKey="count" stroke="#3498db" name="Asistencias" />
							<Line type="monotone" dataKey="inasistencia" stroke="#e74c3c" name="Inasistencias" />
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="col-span-1 bg-white p-4 shadow-md rounded-lg">
					<h2>Distribución de Asistencias</h2>
					<ResponsiveContainer width="100%" height={250}>
						<BarChart data={inasistencia}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="count" fill="#82ca9d" />
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="col-span-1 bg-white p-4 shadow-md rounded-lg">
					<h2>Porcentaje de Asistencias y Inasistencia</h2>
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={[
									{
										name: "Asistencia",
										value: asistencia.reduce((acc, item) => acc + item.count, 0),
									},
									{
										name: "Inasistencia",
										value: inasistencia.reduce((acc, item) => acc + item.count, 0),
									},
								]}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={80}
								fill="#8884d8"
								label={({ name, value }) => `${name}: ${value}`}
							/>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</PageLayout>
	)
}

export default StatisticsPage
