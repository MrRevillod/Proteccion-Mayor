import GeneralStatisticsForm from "@/components/forms/statistics/General"
import PageLayout from "@/layouts/PageLayout"
import { Report } from "@/lib/types"
import React, { useEffect } from "react"
import { useState } from "react"
import ApexCharts from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { XAxis } from "recharts"
import { statisticsSchemas } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import es from "apexcharts/dist/locales/es.json"


const GeneralStatisticsPage: React.FC = () => {
    const [reportData, setReportData] = useState<Report>()

    const methods = useForm({
        resolver: zodResolver(statisticsSchemas.General),
        defaultValues: {
            from: dayjs().subtract(1, "month").toISOString(),
            to: dayjs().add(1,"month").toISOString(),
            center: "",
            professional: "",
            service: "",
        }
    })
    const [state, setState] = useState({
        series: [{
            name: "Ausencias",
            data: reportData?.absence
        },
        {
            name: "Asistencias",
            data: reportData?.assistance
        },
        {
            name: "Sin reservar",
            data: reportData?.unreserved
        }
        ],
        options: {
            chart: {
                id: 'area-datetime',
                type: 'area',
                height: 350,
                zoom: {
                    type:"x",
                    enabled: true,
                    autoScaleYaxis: true
                },
                locales: [es],
                defaultLocale: 'es',
                

            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            markers: {
                size: 0,

            },
            xaxis: {
                type: 'datetime',

            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
                }
            },

        },


        selection: 'one_year',

    })

    useEffect(() => {
        console.log(reportData?.absence.length)
        const { from, to } = methods.getValues()
        console.log(from)
        setState({
            ...state,
            series: [
                {
                    name: "Ausencias",
                    data: reportData?.absence
                },
                {
                    name: "Asistencias",
                    data: reportData?.assistance
                },
                {
                    name: "Sin reservar",
                    data: reportData?.unreserved
                }
            ],
            options: {
                ...state.options,
                xaxis: {
                    type: 'datetime',
                    min: new Date(from).getTime(),

                }
            }

        })
    }, [reportData])



    return (
        <PageLayout
            pageTitle="Reporte general del sistema"
        >
            <FormProvider {...methods}>
                <GeneralStatisticsForm setReportData={setReportData} />
                <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
            </FormProvider>
        </PageLayout>
    )
}

export default GeneralStatisticsPage