import React, { useEffect } from "react"

import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"

import dayjs from "dayjs"

import { Center, Professional, Service, StatisticResponse, Report } from "@/lib/types"
import { getCenters, getGeneralStatistics, getProfessionals, getServices } from "@/lib/actions"
import { selectDataFormatter } from "@/lib/formatters"

import { SuperSelect } from "@/components/ui/SuperSelect"
import { message } from "antd"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { Button } from "@/components/ui/Button"
import { FormProvider, get, set, useForm, useFormContext } from "react-hook-form"
import { statisticsSchemas } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "../Form"



type GeneralStatisticsFormProps = {
    setReportData: (data: Report) => void
}

const GeneralStatisticsForm = ({ setReportData }: GeneralStatisticsFormProps) => {
    const methods = useFormContext()

    const [centers, setCenters] = useState<Center[]>([])
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [services, setServices] = useState<Service[]>([])

    const professional = methods.watch("professional")
    const service = methods.watch("service")
    const center = methods.watch("center")

    const from = methods.watch("from")
    const to = methods.watch("to")

    const getStatistics = async () => {
        if (!from || !to) {
            message.error("Debe seleccionar un rango de fechas")
            return
        }

        try {
            const query = `from=${from}&to=${to}&${center ? `centerId=${center}` : ""}&${service ? `serviceId=${service}` : ""}&${professional ? `professionalId=${professional}` : ""}`
            const res = await getGeneralStatistics({ query })
            setReportData(res.data.values as Report)
        } catch (error) {
            message.error("Error al generar estadísticas")
        }
    }


    useEffect(() => {
        getStatistics()
    },[])
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault()
        getStatistics()
    }

    const centerReq = useRequest<Center[]>({
        action: getCenters,
        query: "select=name,id",
        onSuccess: (data) => selectDataFormatter({ data, setData: setCenters, allString: true, addAll: true }),
    })

    const serviceReq = useRequest<Service[]>({
        action: getServices,
        query: "select=name,id",
        onSuccess: (data) => selectDataFormatter({ data, setData: setServices, addAll: true }),
    })

    const professionalReq = useRequest<Professional[]>({
        action: getProfessionals,
        query: "select=name,id",
        onSuccess: (data) => {
            selectDataFormatter({ data, setData: setProfessionals, addAll: true })
        },
    })

    if (centerReq.error || serviceReq.error || professionalReq.error) {
        message.error("Error al cargar los datos")
    }

    return (
            <form className="md:grid grid-cols-6 gap-4 w-full items-end p-4  " onSubmit={handleSubmit}>
                <DatetimeSelect showTime={false} label="Desde" name="from" defaultValue={(dayjs().subtract(1, "month"))} />
                <DatetimeSelect showTime={false} label="Hasta" name="to" defaultValue={dayjs().add(1,"month")} />

                <SuperSelect name="center" label="Centro" options={centers} />
                <SuperSelect disabled={Boolean(professional)} name="service" label="Servicio" options={services} />
                <SuperSelect disabled={Boolean(service)} name="professional" label="Profesional" options={professionals} />
                <Button className="h-3/4" type="submit" variant="primary" >
                    Generar estadísticas
                </Button>
            </form>
    )
}

export default GeneralStatisticsForm

