import dayjs from "dayjs"

import { match } from "ts-pattern"
import { ReportsService } from "./service"
import { AppError, Controller } from "@repo/lib"
import { Prisma } from "@prisma/client"
import { prisma } from "@repo/database"

type eventDayDict = {
    [key: string]: any[]
}

export class ReportsController {
	constructor(private service: ReportsService) {}


    public generateRangeStats: Controller = async (req, res, next) => {
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

            const events = await prisma.event.findMany({
                where: {
                    start: { gte: fromDate.startOf("day").toISOString() },
                    end: { lte: toDate.endOf("day").toISOString() },
                    AND: filters

                }
            })

            let eventsParsedByDay: eventDayDict = {}

            let assistance: [number, number][] = []
            let absence: [number, number][] = []
            let unreserved: [number, number][] = []



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
                }
                curDay = curDay.add(1, "day")
            }

            days.map(day => {
                
                const events = eventsParsedByDay[day]
                const assistances = events.filter(event => event.assistance)
                const absences = events.filter(event => !event.assistance)
                const unreserveds = events.filter(event => !event.seniorId)

                absence.push([new Date(day).getTime(), absences.length])
                assistance.push([new Date(day).getTime(), assistances.length])
                unreserved.push([new Date(day).getTime(), unreserveds.length])

                return {
                    date: day,
                    assistances: assistances.length,
                    absences: absences.length,
                    unreserved: unreserved.length
                }
            })


            absence = absence.sort((a, b) => a[0] - b[0])
            assistance = assistance.sort((a, b) => a[0] - b[0])
            unreserved = unreserved.sort((a, b) => a[0] - b[0])

            res.json({
                values: { absence, assistance, unreserved },
            })

        } catch (error) {
            next(error)
        }

    }
}
