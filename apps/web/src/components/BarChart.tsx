import React, { useEffect } from "react"
import { useState } from "react"
import ReactApexChart, * as chart from "react-apexcharts"


type serie = {
    name: string,
    data: number[]
}
type BarChartProps = {
    series: serie[]
    categories: string[]
}

export const BarChart = ({ series, categories }: BarChartProps) => {
    const [data, setData] = useState()


    useEffect(() => {
        console.log(series, categories)
        if (series && categories) {
            setData({
                ...data,
                series: series,
                options: {
                    ...data.options,
                    xaxis: {
                        ...data.options.xaxis,
                        categories: categories
                    }
                }
            })
        }
    }, [series, categories])

    return (
        <ReactApexChart options={data.options} series={data.series} type="bar" />
    )

}