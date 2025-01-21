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
                    ...filters

                }
            })

            let eventsParsedByDay: eventDayDict = {}

            events.map(event => {
                eventsParsedByDay[event.start.toISOString()].push(event)
            })

            const days = Object.keys(eventsParsedByDay)
            const report = days.map(day => {
                const events = eventsParsedByDay[day]
                const assistances = events.filter(event => event.assistance)
                const absences = events.filter(event => !event.assistance)
                const unreserved = events.filter(event => !event.seniorId)

                return {
                    date: day,
                    assistances: assistances.length,
                    absences: absences.length,
                    unreserved: unreserved.length
                }
            })

            res.json({ values: { report } })

        } catch (error) {
            next(error)
        }

    }
}
