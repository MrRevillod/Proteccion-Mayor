import React, { useEffect, useState } from "react"
import {
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Line,
	LineChart,
	BarChart,
	Bar,
	Tooltip,
	Legend,
} from "recharts"
import PageLayout from "../../layouts/PageLayout"
import axios from "axios"

interface ReportData {
	date: string
	assistance: boolean
	count: number
}

const StatisticsPage: React.FC = () => {
	const [data, setData] = useState<ReportData[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("/api/dashboard/reports/concurrencia")
				setData(response.data)
			} catch (error) {
				console.error("Error al obtener los datos:", error)
			}
		}

		fetchData()
	}, [])

	const assistedData = data.filter((item) => item.assistance)
	const notAssistedData = data.filter((item) => !item.assistance)

	const groupedData = data.reduce((acc: any[], curr) => {
		const existingDate = acc.find((item) => item.date === curr.date)

		if (existingDate) {
			if (curr.assistance) {
				existingDate.assisted = curr.count
			} else {
				existingDate.notAssisted = curr.count
			}
		} else {
			acc.push({
				date: curr.date,
				assisted: curr.assistance ? curr.count : 0,
				notAssisted: !curr.assistance ? curr.count : 0,
			})
		}

		return acc
	}, [])

	return (
		<PageLayout pageTitle="Concurrencia de eventos">
			<h2>Eventos Asistidos</h2>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart data={assistedData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Line dataKey="count" fill="Black" stroke="green" name="Asistidos" />
				</LineChart>
			</ResponsiveContainer>

			<h2>Eventos No Asistidos</h2>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart data={notAssistedData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Line dataKey="count" fill="Black" name="No Asistidos" />
				</LineChart>
			</ResponsiveContainer>

			<h2>Asistencia vs No Asistencia</h2>
			<ResponsiveContainer width="100%" height={400}>
				<BarChart data={groupedData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="assisted" stackId="a" fill="#82ca9d" name="Asistidos" />
					<Bar dataKey="notAssisted" stackId="a" fill="red" name="No Asistidos" />
				</BarChart>
			</ResponsiveContainer>
		</PageLayout>
	)
}

export default StatisticsPage
