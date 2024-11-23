import dayjs from "dayjs"
import React from "react"
import PageLayout from "@/layouts/PageLayout"

import { Show } from "@/components/ui/Show"
import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"
import { StatisticSelection } from "@/components/StatisticSelection"
import { AssistanceSelection } from "@/components/AssistanceSelection"
import { getOneProfessional, getProfessionals, getReports } from "@/lib/actions"
import { abbreviateCenterName, capitalize } from "@/lib/formatters"
import { ChartLayout, StatisticMainLayout } from "@/layouts/StatisticLayout"
import { AssistanceType, Professional, QueryActionProps, ReportType } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

import "@/main.css"
import "dayjs/locale/es"

dayjs.locale("es")

type StatisticResponse = {
	report: any[]
}

export type SelectedProfessional = {
	id: string
	name: string
}

const StatisticsPage: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<string>(dayjs().year().toString())
	const [reportSelection, setReportSelection] = useState<ReportType>("general")
	const [selectedProfessional, setSelectedProfessional] = useState<SelectedProfessional>({ id: "", name: "" })
	const [reportData, setReportData] = useState<any[]>([])
	const [assistanceSelection, setAssistanceSelection] = useState<AssistanceType[]>([
		"assistance",
		"absence",
		"unreserved",
	])

	const handleAssistanceSelection = (selection: AssistanceType) => {
		if (assistanceSelection.includes(selection)) {
			setAssistanceSelection(assistanceSelection.filter((item) => item !== selection))
		} else {
			setAssistanceSelection([...assistanceSelection, selection])
		}
	}

	useRequest<StatisticResponse>({
		action: getReports,
		query: `type=${reportSelection}&date=${selectedDate}&${reportSelection === "byProfessional" ? `professionalId=${selectedProfessional.id}` : ""}`,
		onSuccess: (data) => {
			setReportData(data.report)
		},
	})

	useRequest<Professional>({
		action: getOneProfessional,
		query: `id=${selectedProfessional.id}&select=name`,
		trigger: reportSelection === "byProfessional" && selectedProfessional.id !== "",
		onSuccess: (data) => {
			setSelectedProfessional({ id: selectedProfessional.id, name: data.name })
		},
	})

	const formatStrDate = (date: string) => {
		return dayjs(date).format("MMMM YYYY").split(" ").map(capitalize).join(" ")
	}

	const titles = (type: ReportType) => {
		switch (type) {
			case "general":
				return `Reporte general de asistencia del año ${selectedDate}`
			case "byService":
				return `Reporte de asistencia por servicio en ${formatStrDate(selectedDate)}`
			case "byCenter":
				return `Reporte de asistencia por centros en ${formatStrDate(selectedDate)}`
			case "byProfessional":
				return `Reporte de asistencia de ${selectedProfessional.name} en el año ${selectedDate}`
		}
	}

	return (
		<PageLayout
			pageTitle="Reporte general del sistema"
			customRightSide={<StatisticSelection setReportSelection={setReportSelection} setSelectedProfessional={setSelectedProfessional} />}
		>
			<StatisticMainLayout>
				<ChartLayout
					size="lg"
					reportSelection={reportSelection}
					setDate={setSelectedDate}
					title={titles(reportSelection)}
					monthSelect={reportSelection !== "general" && reportSelection !== "byProfessional"}
					yearSelect
				>
					<Show when={reportSelection === "general" || (reportSelection === "byProfessional" && !!selectedProfessional.id)}>
						<ResponsiveContainer width="100%" height={500} style={{ marginLeft: "0px" }}>
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
									tick={{ fill: "#6B7280" }}
								/>
								<YAxis allowDecimals={false} />
								<Tooltip labelFormatter={(str) => dayjs(str).format("MMMM YYYY")} />

								{assistanceSelection.includes("assistance") && (
									<Line type="monotone" dataKey="assistances" stroke="#008000" name="Asistencia" />
								)}

								{assistanceSelection.includes("absence") && (
									<Line type="monotone" dataKey="absences" stroke="#FF0000" name="Inasistencia" />
								)}

								{assistanceSelection.includes("unreserved") && (
									<Line type="monotone" dataKey="unreserved" stroke="#0000FF" name="No Reservado" />
								)}
							</LineChart>
						</ResponsiveContainer>
					</Show>
					<Show when={reportSelection !== "general" && reportSelection !== "byProfessional"}>
						<ResponsiveContainer width="100%" height={500} style={{ marginLeft: "0px" }}>
							<BarChart data={reportData} margin={{ top: 20, right: 20, left: -25, bottom: 20 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey={reportSelection === "byCenter" ? "center" : "service"}
									tickFormatter={
										reportSelection === "byCenter" ? (value) => abbreviateCenterName(value) : undefined
									}
								/>
								<YAxis allowDecimals={false} />
								<Tooltip />
								{assistanceSelection.includes("assistance") && (
									<Bar dataKey="assistances" fill="#008000" name="Asistencia" />
								)}
								{assistanceSelection.includes("absence") && (
									<Bar dataKey="absences" fill="#FF0000" name="Inasistencia" />
								)}
								{assistanceSelection.includes("unreserved") && (
									<Bar dataKey="unreserved" fill="#0000ff" name="No Reservado" />
								)}
							</BarChart>
						</ResponsiveContainer>
					</Show>
					<AssistanceSelection
						assistanceSelection={assistanceSelection}
						setSelection={handleAssistanceSelection}
					/>
				</ChartLayout>

			</StatisticMainLayout>
		</PageLayout>
	)
}

export default StatisticsPage