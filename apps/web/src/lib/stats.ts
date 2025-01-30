import { ApexOptions } from "apexcharts"
import es from "apexcharts/dist/locales/es.json"

export const barChartState = {
    series: [{
        name: 'Ausencias',
        data: [] as number[]
    }, {
        name: 'Asistencias',
        data: [] as number[]
    }, {
        name: 'Sin reservar',
        data: [] as number[]
    }] as ApexAxisChartSeries,
    options: {
        chart: {
            type: 'bar',
            height: "350"
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: [] as string[],
            labels: {
                trim: true,
                formatter: (value: string) => {
                    const val = value.split(" ")
                    let ret = ""
                    if ((val[0] + val[1]).toLowerCase() === "centrocomunitario") {
                        for (let i = 2; i < val.length; i++) {
                            if (val[i]) {
                                ret = ret + " " + val[i]
                            }
                        }
                        return ret
                    }
                    return val

                }
            }
        },

        fill: {
            opacity: 1
        },
    } as ApexOptions,
}

export const lineChartState = {
    series: [{
        name: "Ausencias",
        data: [] as [number, number][] | undefined
    },
    {
        name: "Asistencias",
        data: [] as [number, number][] | undefined
    },
    {
        name: "Sin reservar",
        data: [] as [number, number][] | undefined
    }
    ] as ApexAxisChartSeries,
    options: {
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 350,
            zoom: {
                type: "x",
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
            curve: 'smooth'
        },
        markers: {
            size: 0,

        },
        xaxis: {
            type: 'datetime',
            min: new Date().getTime(),

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

    } as ApexOptions,
    selection: 'one_year',

}