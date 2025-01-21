import React from "react"

import { useState } from "react"
import { useRequest } from "@/hooks/useRequest"

import dayjs, { Dayjs } from "dayjs"

import { Center, Professional, Service, StatisticResponse, Report } from "@/lib/types"
import { getCenters, getGeneralStatistics, getProfessionals, getServices } from "@/lib/actions"
import { selectDataFormatter } from "@/lib/formatters"

import { SuperSelect } from "@/components/ui/SuperSelect"
import { message } from "antd"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { Button } from "@/components/ui/Button"



type GeneralStatisticsFormProps = {
    setReportData: (data: Report[]) => void
}

const GeneralStatisticsForm = ({ setReportData }: GeneralStatisticsFormProps) => {

    const [centers, setCenters] = useState<Center[]>([])
    const [proffesionals, setProfessionals] = useState<Professional[]>([])
    const [services, setServices] = useState<Service[]>([])

    const [from, setFrom] = useState<string>((new Dayjs().subtract(1, "year")).toISOString())
    const [to, setTo] = useState<string>((new Dayjs()).toISOString())

    const [center, setCenter] = useState<string>()
    const [service, setService] = useState<string>()
    const [professional, setProfessional] = useState<string>()



    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
        ev.preventDefault()
        useRequest<StatisticResponse>({
            action: getGeneralStatistics,
            query: `from=${from}&to=${to}&${center ? `centerId=${center}` : ""}&${service ? `serviceId=${service}` : ""}&${professional ? `professionalId=${professional}` : ""}`,
            onSuccess: (data) => {
                setReportData(data.report)
            },
        })
    }

    const centerReq = useRequest<Center[]>({
        action: getCenters,
        query: "select=name,id",
        onSuccess: (data) => selectDataFormatter({ data, setData: setCenters, allString: true }),
    })

    const serviceReq = useRequest<Service[]>({
        action: getServices,
        query: "select=name,id",
        onSuccess: (data) => selectDataFormatter({ data, setData: setServices }),
    })

    const professionalReq = useRequest<Professional[]>({
        action: getProfessionals,
        query: "select=name,id",
        onSuccess: (data) => setProfessionals(data),
    })

    if (centerReq.error || serviceReq.error || professionalReq.error) {
        message.error("Error al cargar los datos")
    }

    return (
        <form onSubmit={handleSubmit}>
            <DatetimeSelect label="Desde" name="from" defaultValue={new Dayjs(from)} onChange={(date) => { setFrom(date ? dayjs(date).toISOString() : from) }} />
            <DatetimeSelect label="Hasta" name="to" defaultValue={new Dayjs(to)} onChange={(date) => { setTo(date ? dayjs(date).toISOString() : to) }} />

            <SuperSelect name="center" label="Centro" options={centers} onChange={(value) => setCenter(value)} />
            <SuperSelect name="service" label="Servicio" options={services} onChange={(value) => setService(value)} />
            <SuperSelect name="professional" label="Profesional" options={proffesionals} onChange={(value) => setProfessional(value)} />
            <Button type="submit" variant="primary" >
                Guardar
            </Button>
        </form>
    )
}

export default GeneralStatisticsForm

