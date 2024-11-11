import dayjs from "dayjs"
import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { useState } from "react"
import { getReports } from "@/lib/actions"
import { capitalize } from "@/lib/formatters"
import { useRequest } from "@/hooks/useRequest"
import { AssistanceSelection } from "@/components/AssistanceSelection"
import { ChartLayout, StatisticMainLayout } from "@/layouts/StatisticLayout"
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Legend,
	Cell,
} from "recharts"

import "@/main.css"
import "dayjs/locale/es"
import { Statistic } from "antd"

dayjs.locale("es")

type AssistanceNumericData = {
	totalAssistance: number
	totalNotAssistance: number
	totalEvents: number
}

const StatisticsPage: React.FC = () => {
	const [reportData, setReportData] = useState([])
	const [assistanceNumericData, setAssistanceNumericData] = useState<AssistanceNumericData>()
	const [assistanceSelection, setAssistanceSelection] = useState<string[]>(["assistance"])

	const handleAssistanceSelection = (selection: string) => {
		if (assistanceSelection.includes(selection)) {
			setAssistanceSelection(assistanceSelection.filter((item) => item !== selection))
		} else {
			setAssistanceSelection([...assistanceSelection, selection])
		}
	}

	useRequest<any>({
		action: getReports,
		onSuccess: (data) => {
			setReportData(data.general.data)
			setAssistanceNumericData(data.general.numbers)
		},
	})

	return (
		<PageLayout pageTitle="Reporte general del sistema">
			<StatisticMainLayout>
				<ChartLayout title="Asistencia a través del tiempo" size="lg" yearSelect>
					<ResponsiveContainer width="100%" height={400} style={{ marginLeft: "0px" }}>
						<LineChart data={reportData} margin={{ top: 20, right: 20, left: -25, bottom: 40 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="month"
								axisLine={false}
								tickLine={false}
								interval={0}
								textAnchor="end"
								dy={10}
								angle={-45}
								tickFormatter={(value) => capitalize(dayjs(value).format("MMM"))}
							/>
							<YAxis allowDecimals={false} />
							<Tooltip labelFormatter={(str) => dayjs(str).format("MMMM YYYY")} />

							{assistanceSelection.includes("assistance") && (
								<Line type="monotone" dataKey="assistance" stroke="#008000" name="Asistencia" />
							)}

							{assistanceSelection.includes("absence") && (
								<Line type="monotone" dataKey="notAssistance" stroke="#FF0000" name="Inasistencia" />
							)}

							{assistanceSelection.includes("unreserved") && (
								<Line type="monotone" dataKey="notReserved" stroke="#0000FF" name="No Reservado" />
							)}
						</LineChart>
					</ResponsiveContainer>
					<AssistanceSelection
						assistanceSelection={assistanceSelection}
						setSelection={handleAssistanceSelection}
					/>
				</ChartLayout>

				<ChartLayout title="Información de interés" size="sm">
					<div className="flex flex-row w-full items-center justify-center rounded-lg">
						<div className="bg-neutral-200 w-1/2 flex justify-center ">
							<h3>Total</h3>
						</div>
						<div className="bg-neutral-200 w-1/2 flex justify-center">
							<h3>Promedio mensual</h3>
						</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="bg-neutral-200 w-full flex justify-center">
							<h3>Personas atendidas</h3>
						</div>
						<div className="flex flex-row w-full items-center">
							<h3 className="w-1/2 flex justify-center">{assistanceNumericData?.totalAssistance}</h3>
							<h3 className="w-1/2 flex justify-center">
								{(assistanceNumericData?.totalAssistance ?? 0) / 12}
							</h3>
						</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="bg-neutral-200 w-full flex justify-center">
							<h3>Inacistencia</h3>
						</div>
						<div className="flex flex-row w-full items-center">
							<h3 className="w-1/2 flex justify-center">{assistanceNumericData?.totalNotAssistance}</h3>
							<h3 className="w-1/2 flex justify-center">
								{(assistanceNumericData?.totalNotAssistance ?? 0) / 12}
							</h3>
						</div>
					</div>
					<div className="flex flex-col w-full">
						<div className="bg-neutral-200 w-full flex justify-center">
							<h3>No reservado</h3>
						</div>
						<div className="flex flex-row w-full items-center">
							<h3 className="w-1/2 flex justify-center">{assistanceNumericData?.totalEvents}</h3>
							<h3 className="w-1/2 flex justify-center">
								{(assistanceNumericData?.totalEvents ?? 0) / 12}
							</h3>
						</div>
					</div>

					<div className="flex flex-col w-full">
						<div className="bg-neutral-200 w-full flex justify-center">
							<h3>Atención creadas</h3>
						</div>
						<div className="flex flex-row w-full items-center">
							<h3 className="w-1/2 flex justify-center">{assistanceNumericData?.totalEvents}</h3>
							<h3 className="w-1/2 flex justify-center">
								{(assistanceNumericData?.totalEvents ?? 0) / 12}
							</h3>
						</div>
					</div>
				</ChartLayout>
			</StatisticMainLayout>
		</PageLayout>
	)
}

export default StatisticsPage
