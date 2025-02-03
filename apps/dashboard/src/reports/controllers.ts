import dayjs from "dayjs"

import { ReportsService } from "./service"
import { AppError, Controller, documents } from "@repo/lib"
import { Prisma } from "@prisma/client"
import { prisma } from "@repo/database"

export type eventReportDict = {
    [key: string]: any[]
}
export type eventSplitedDict = {
    [key: string]: {
        assistance: number,
        absence: number,
        unreserved: number
    }
}

export type reportHead = {
    from: string,
    to: string,
    centerName: string,
    serviceName: string,
    professionalName: string,
}

export class ReportsController {
	constructor(private service: ReportsService) {}


    public generateRangeStats: Controller = async (req, res, next) => {
        try {
            const head: reportHead = {
                from: req.query.from as string,
                to: req.query.to as string,
                centerName: "",
                serviceName: "",
                professionalName: "",
            }

            const filters: Prisma.EventWhereInput[] = []
            const from = req.query.from as string
            const to = req.query.to as string
            const centerId = req.query.centerId as string
            const serviceId = req.query.serviceId as string
            const professionalId = req.query.professionalId as string

            const fromDate = dayjs(from)
            const toDate = dayjs(to)

            if (!fromDate.isValid() || !toDate.isValid()) {
                throw new AppError(400, "Invalid date range")
            }

            if (fromDate.isAfter(toDate)) {
                throw new AppError(400, "Invalid date range")
            }

            let fromDay = fromDate.startOf("day")
            let toDay = toDate.endOf("day")

            if (centerId) {
                filters.push({ centerId: Number(centerId) })
            }

            if (serviceId) {
                filters.push({ serviceId: Number(serviceId) })
            }

            if (professionalId) {
                filters.push({ professionalId: professionalId })
            }

            let eventsParsedByDay: eventReportDict = {}
            let assistance: [number, number][] = []
            let absence: [number, number][] = []
            let unreserved: [number, number][] = []

            const events = await prisma.event.findMany({
                where: {
                    start: { gte: fromDate.startOf("day").toISOString() },
                    end: { lte: toDate.endOf("day").toISOString() },
                    AND: filters

                },
                select: this.service.allSelect,
                orderBy: { start: "asc" },
            })

            console.log(events)
            if (professionalId) {
                const professional = await prisma.professional.findUnique({ where: { id: professionalId } })
                head.professionalName = professional?.name || ""
            }

            if (serviceId) {
                const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } })
                head.serviceName = service?.name || ""
            }

            if (centerId) {
                const center = await prisma.center.findUnique({ where: { id: Number(centerId) } })
                head.centerName = center?.name || ""
            }

            events.map(event => {
                const dayISO = event.start.toISOString().split("T")[0] + "T00:00:00.000Z"
                if (!eventsParsedByDay[dayISO]) {
                    eventsParsedByDay[dayISO] = []
                }
                eventsParsedByDay[dayISO].push(event)
            })
            const days = Object.keys(eventsParsedByDay)
            // crear un arreglo con todas las fechas desde from hasta to 

            let curDay = fromDay
            while (curDay.isBefore(toDay)) {
                const dayISO = curDay.toISOString().split("T")[0] + "T00:00:00.000Z"
                if (days.indexOf(dayISO) === -1) {
                    absence.push([new Date(dayISO).getTime(), 0])
                    assistance.push([new Date(dayISO).getTime(), 0])
                    unreserved.push([new Date(dayISO).getTime(), 0])
                } else {
                    const events = eventsParsedByDay[dayISO]
                    const assistances = events.filter(event => event.assistance)
                    const absences = events.filter(event => !event.assistance)
                    const unreserveds = events.filter(event => !event.seniorId)

                    absence.push([new Date(dayISO).getTime(), absences.length])
                    assistance.push([new Date(dayISO).getTime(), assistances.length])
                    unreserved.push([new Date(dayISO).getTime(), unreserveds.length])

                }
                curDay = curDay.add(1, "day")
            }
            
            const professional = !professionalId ? (serviceId ? await this.service.splitByProfessional(events, Number(serviceId)) :
                await this.service.splitByProfessional(events)) : {}

            res.json({
                values: {
                    head,
                    absence, assistance, unreserved,
                    splitted: {
                        center: !centerId ? await this.service.splitByCenter(events) : {},
                        service: !serviceId ? await this.service.splitByService(events) : {},
                        professional: professional 
                    }
                },
            })

        } catch (error) {
            next(error)
        }
    }

    public generateRangeDocument: Controller = async (req, res, next) => {
        try {
            const filters: Prisma.EventWhereInput[] = []

            const from = req.query.from as string
            const to = req.query.to as string
            const centerId = req.query.centerId as string
            const serviceId = req.query.serviceId as string
            const professionalId = req.query.professionalId as string

            const fromDate = dayjs(from)
            const toDate = dayjs(to)

            if (!fromDate.isValid() || !toDate.isValid()) {
                throw new AppError(400, "Invalid date range")
            }

            if (fromDate.isAfter(toDate)) {
                throw new AppError(400, "Invalid date range")
            }


            if (centerId) {
                filters.push({ centerId: Number(centerId) })
            }

            if (serviceId) {
                filters.push({ serviceId: Number(serviceId) })
            }

            if (professionalId) {
                filters.push({ professionalId: professionalId })
            }
            const events = await prisma.event.findMany({
                where: {
                    start: { gte: fromDate.startOf("day").toISOString() },
                    end: { lte: toDate.endOf("day").toISOString() },
                    AND: filters

                },
                select: this.service.allSelect,
                orderBy: { start: "asc" },
            })

            documents.generarExcel(events).then((buffer: Buffer) => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx')
                res.send(buffer)
            }).catch((error: any) => {
                next(error)
            })
            console.log(events)

        } catch (error) {
            next(error)
        }
    }




}
