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
	PieChart,
	Pie,
	ScatterChart,
	Scatter,
} from "recharts"
import PageLayout from "../../layouts/PageLayout"
import { useRequest } from "@/hooks/useRequest"
import { message, Checkbox } from "antd"
import { getReports } from "@/lib/actions"

type FormattedDateCount = {
	date: string
	count: number
}
interface StatisticsResponse {
	formattedAssistanceEvents: FormattedDateCount[]
	formattedNoAssistanceEvents: FormattedDateCount[]
	totalAssistanceCount: number
	totalNoAssistanceCount: number
}

const StatisticsPage: React.FC = () => {
	const [asistencia, setAsistencia] = useState<FormattedDateCount[]>([])
	const [inasistencia, setInasistencia] = useState<FormattedDateCount[]>([])
	const [totalAsistencia, setTotalAsistencia] = useState<number>(0)
	const [totalInasistencia, setTotalInacistencia] = useState<number>(0)
	const [showAsistencia, setShowAsistencia] = useState<boolean>(true)
	const [showInasistencia, setShowInasistencia] = useState<boolean>(false)

	const { error } = useRequest<StatisticsResponse>({
		action: getReports,
		onSuccess: (data) => {
			setAsistencia(data.formattedAssistanceEvents)
			setInasistencia(data.formattedNoAssistanceEvents)
			setTotalAsistencia(data.totalAssistanceCount)
			setTotalInacistencia(data.totalNoAssistanceCount)
		},
	})

	if (error) message.error("Error al cargar los datos")

	const totalEventos = totalAsistencia + totalInasistencia
	const porcentajeAsistencia = totalEventos ? (totalAsistencia / totalEventos) * 100 : 0
	const porcentajeInasistencia = totalEventos ? (totalInasistencia / totalEventos) * 100 : 0

	return (
		<PageLayout pageTitle="Concurrencia de eventos y Asistencia por Centros">
			{/* Controles de los checkboxes */}
			<div className="flex space-x-4 p-4">
				<Checkbox checked={showAsistencia} onChange={(e) => setShowAsistencia(e.target.checked)}>
					Mostrar Asistencia
				</Checkbox>
				<Checkbox checked={showInasistencia} onChange={(e) => setShowInasistencia(e.target.checked)}>
					Mostrar Inasistencia
				</Checkbox>
			</div>

			<div className="grid grid-cols-1 gap-4 p-4">
				<div className="col-span-3 bg-white p-4 shadow-md rounded-lg">
					<h2>Tendencia General</h2>
					<ResponsiveContainer width="100%" height={250}>
						<LineChart>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							{showAsistencia && (
								<Line
									type="monotone"
									data={asistencia}
									dataKey="count"
									stroke="#3498db"
									name="Asistencias"
									isAnimationActive={true}
								/>
							)}
							{showInasistencia && (
								<Line
									type="monotone"
									data={inasistencia}
									dataKey="count"
									stroke="#e74c3c"
									name="Inasistencias"
									isAnimationActive={true}
								/>
							)}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4 p-4">
				<div className="bg-white p-4 shadow-md rounded-lg col-span-1">
					<h2>Porcentaje de Asistencias y Inasistencias</h2>
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={[
									{ name: "Asistencia", value: porcentajeAsistencia, fill: "#3498db" },
									{ name: "Inasistencia", value: porcentajeInasistencia, fill: "#e74c3c" },
								]}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={80}
								label={({ value }) => `${value.toFixed(2)}%`}
							/>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>

					<div className="mt-4 flex justify-around">
						<div className="flex items-center">
							<div className="w-3 h-3 mr-2 bg-[#3498db]" />
							<span>Asistencia</span>
						</div>
						<div className="flex items-center">
							<div className="w-3 h-3 mr-2 bg-[#e74c3c]" />
							<span>Inasistencia</span>
						</div>
					</div>
					<div className="bg-white p-4 shadow-md rounded-lg col-span-1 flex justify-center items-center">
						<div className="grid grid-cols-2 gap-4">
							<p className="text-lg font-semibold text-center bg-[#3498db]">
								Total Asistidos: <span className="text-blue-600">{totalAsistencia}</span>
							</p>
							<p className="text-lg font-semibold text-center  bg-[#e74c3c]">
								Total Inasistidos: <span className="text-red-600">{totalInasistencia}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	)
}

export default StatisticsPage
