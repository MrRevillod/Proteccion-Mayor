import { useState } from "react"
import React, { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRequest } from "@/hooks/useRequest"

import ReactApexChart from "react-apexcharts"
import dayjs from "dayjs"
import { PiFilePdfFill, PiMicrosoftExcelLogoFill } from "react-icons/pi"
import { FaFilePdf } from "react-icons/fa6"
import { Descriptions, message, Tooltip } from "antd"

import PageLayout from "@/layouts/PageLayout"
import GeneralStatisticsForm from "@/components/forms/statistics/General"
import { Show } from "@/components/ui/Show"
import { PageHeader } from "@/components/PageHeader"
import { Table } from "@/components/Table"

import { Professional, ProfessionalTableRow, Report, Splitted } from "@/lib/types"
import { statisticsSchemas } from "@/lib/schemas"
import { chartSeriesFormatter } from "@/lib/formatters"
import { barChartState, lineChartState } from "@/lib/stats"
import { getProfessionals } from "@/lib/actions"
import { API_URL } from "@/lib/axios"
import { ProfessionalReportColumns } from "@/lib/columns"
import { Button } from "@/components/ui/Button"
import { ApexOptions } from "apexcharts"
import { generateReportPDF } from "@/lib/downloadDailyAgenda"

const sumColumn = (data: [number, number][], column: number) => {
	return data.reduce((acc, current) => {
		return acc + current[column]
	}, 0)
}

const GeneralStatisticsPage: React.FC = () => {
	const [reportData, setReportData] = useState<Report>({
		head: {
			from: "",
			to: "",
			centerName: "",
			serviceName: "",
			professionalName: "",
		},
		assistance: [],
		absence: [],
		unreserved: [],
		splitted: {
			center: {},
			service: {},
			professional: {},
		},
	})

	const methods = useForm({
		resolver: zodResolver(statisticsSchemas.General),
		defaultValues: {
			from: dayjs().subtract(1, "month").toISOString(),
			to: dayjs().add(1, "month").toISOString(),
			centerId: "",
			professionalId: "",
			serviceId: "",
		},
	})
	const [state, setState] = useState<{ series: ApexAxisChartSeries; options: ApexOptions }>(lineChartState)
	const [centerState, setCenterState] = useState<{ series: ApexAxisChartSeries; options: ApexOptions }>(barChartState)
	const [serviceState, setServiceState] = useState<{ series: ApexAxisChartSeries; options: ApexOptions }>(
		barChartState,
	)
	const [proffesionalState, setProffesionalState] = useState<Splitted>({})
	const [tableProfessional, setTableProfessional] = useState<ProfessionalTableRow[]>([])

	const { error, loading, data } = useRequest<Professional[]>({
		action: getProfessionals,
	})

	const formattedData = data?.map((professional) => {
		return {
			id: professional.id,
			professionalName: professional.name,
			assistance: 0,
			absence: 0,
			unreserved: 0,
			total: 0,
		} as ProfessionalTableRow
	})

	useEffect(() => {
		setTableProfessional(
			Object.keys(proffesionalState).map((key) => {
				return {
					id: key,
					professionalName: key,
					assistance: proffesionalState[key].assistance,
					absence: proffesionalState[key].absence,
					unreserved: proffesionalState[key].unreserved,
					total:
						proffesionalState[key].assistance +
						proffesionalState[key].absence +
						proffesionalState[key].unreserved,
				}
			}),
		)
	}, [proffesionalState])

	useEffect(() => {
		const { from } = methods.getValues()
		setState({
			...state,

			series: [
				{ name: "Ausencias", data: reportData?.absence },
				{ name: "Asistencias", data: reportData?.assistance },
				{
					name: "Sin reservar",
					data: reportData?.unreserved,
				},
			],
			options: {
				...state.options,
				xaxis: { ...state.options.xaxis, type: "datetime", min: new Date(from).getTime() },
			},
		})

		setCenterState({
			...centerState,
			series: reportData ? chartSeriesFormatter(reportData?.splitted.center) : [],
			options: {
				...centerState.options,
				xaxis: {
					...centerState.options.xaxis,
					categories: reportData ? Object.keys(reportData?.splitted.center) : [],
				},
			},
		})

		setServiceState({
			...serviceState,
			series: reportData ? chartSeriesFormatter(reportData?.splitted.service) : [],
			options: {
				...serviceState.options,
				xaxis: {
					...serviceState.options.xaxis,
					categories: reportData ? Object.keys(reportData?.splitted.service) : [],
				},
			},
		})

		setProffesionalState(reportData?.splitted.professional || {})
	}, [reportData])

	const getDocument = async () => {
		const { from, to } = methods.getValues()
		if (!from || !to) {
			message.error("Debe seleccionar un rango de fechas")
			return
		}

		try {
			const link = document.createElement("a")
			link.href = `${API_URL}/dashboard/reports/report-document?from=${from}&to=${to}` // URL del endpoint en tu servidor
			link.download = "reporte.xlsx" // Nombre del archivo al descargar
			link.click()
		} catch (error) {
			message.error("Error al solicitar documento")
		}
	}

	const handleDocument: React.MouseEventHandler<HTMLButtonElement> = async (ev) => {
		ev.preventDefault()
		getDocument()
	}

	return (
		<PageLayout
			pageTitle="Reporte general del sistema"
			customRightSide={
				<Button className="p-0" variant="primary" onClick={handleDocument} title="Descargar documento">
					<div className="flex gap-2 items-center">
						<p>Obtener detalle de atenciones</p>
						<PiMicrosoftExcelLogoFill className="text-xl" />
					</div>
				</Button>
			}
		>
			<FormProvider {...methods}>
				<GeneralStatisticsForm setReportData={setReportData} />
				<Tooltip title="Descargar resumen" placement="top">
					<div className="fixed z-50 bottom-10 right-10">
						<Button
							variant="primary"
							title="Descargar resumen"
							onClick={() => {
								generateReportPDF(reportData)
							}}
						>
							<FaFilePdf className="text-3xl" />
						</Button>
					</div>
				</Tooltip>

				<div className="grid gap-7 p-10">
					<div className={"grid grid-cols-4 gap-7"}>
						<div className="bg-white dark:bg-primary-darker  p-4 rounded-md">
							<Descriptions title="" bordered column={1} size="small">
								<Descriptions.Item label="Desde">
									{dayjs(reportData.head.from).format("DD/MM/YYYY")}
								</Descriptions.Item>
								<Descriptions.Item label="Hasta">
									{dayjs(reportData.head.to).format("DD/MM/YYYY")}
								</Descriptions.Item>
								<Descriptions.Item label="Asistencias totales">
									{sumColumn(reportData?.assistance || [[0, 0]], 1)}
								</Descriptions.Item>
								<Descriptions.Item label="Ausencias totales">
									{sumColumn(reportData?.absence || [[0, 0]], 1)}
								</Descriptions.Item>
								<Descriptions.Item label="Sin reservar">
									{sumColumn(reportData?.unreserved || [[0, 0]], 1)}
								</Descriptions.Item>
								<Descriptions.Item label="Centro">{reportData.head.centerName}</Descriptions.Item>
								<Descriptions.Item label="Servicio">{reportData.head.serviceName}</Descriptions.Item>
								<Descriptions.Item label="Profesional">
									{reportData.head.professionalName}
								</Descriptions.Item>
							</Descriptions>
						</div>
						<div className="col-span-3 bg-white  dark:bg-primary-darker rounded-md">
							<ReactApexChart options={state.options} series={state.series} type="area" height={350} />
						</div>
					</div>
					<div className="grid grid-cols-2 gap-7 ">
						<Show when={!Boolean(reportData?.head.professionalName)}>
							<div className="bg-white rounded-md dark:bg-primary-darker p-4 h-[550px] col-span-2 ">
								<PageHeader
									pageTitle="Profesionales"
									data={formattedData}
									setData={setTableProfessional}
									searchKeys={["professionalName"]}
								></PageHeader>
								<Table<ProfessionalTableRow>
									scroll={{ y: 300 }}
									data={tableProfessional}
									columnsConfig={ProfessionalReportColumns}
								/>
							</div>
						</Show>
						<Show when={reportData?.head.centerName === "" && centerState.series.length > 0}>
							<div className="bg-white rounded-md p-4 dark:bg-primary-darker ">
								<ReactApexChart options={centerState.options} series={centerState.series} type="bar" />
							</div>
						</Show>
						<Show
							when={!Boolean(reportData?.head.serviceName) && !Boolean(reportData?.head.professionalName)}
						>
							<div className="bg-white rounded-md p-4 dark:bg-primary-darker">
								<ReactApexChart
									options={serviceState.options}
									series={serviceState.series}
									type="bar"
								/>
							</div>
						</Show>
					</div>
				</div>
			</FormProvider>
		</PageLayout>
	)
}

export default GeneralStatisticsPage
