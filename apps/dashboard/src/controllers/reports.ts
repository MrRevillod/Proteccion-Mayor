import dayjs from "dayjs"

import { Event } from "@prisma/client"
import { prisma } from "@repo/database"
import { NextFunction, Request, Response } from "express"

export type FormattedDate = {
	date: string
	count: number
}

export const generateGeneralReport = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const assistanceEvents = await getFilteredEvents(true)
		const notAssistanceEvents = await getFilteredEvents(false)
		const notReservedEvents = await getNotReservedEvents()

		const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format("YYYY-MM"))

		const generalAssistanceReportData = months.map((month) => {
			return {
				month,
				notAssistance: findMonthlyCount(notAssistanceEvents, month),
				assistance: findMonthlyCount(assistanceEvents, month),
				notReserved: findMonthlyCount(notReservedEvents, month),
			}
		})

		const totalAssistance = assistanceEvents.length
		const totalNotAssistance = notAssistanceEvents.length
		const totalNotReserved = notReservedEvents.length
		const totalEvents = totalAssistance + totalNotAssistance + totalNotReserved

		res.json({
			values: {
				general: {
					data: generalAssistanceReportData,
					numbers: { totalAssistance, totalNotAssistance, totalEvents },
				},
				centers: {},
				services: {},
			},
		})
	} catch (error) {
		next(error)
	}
}

// Función de utilidad para contar eventos en un mes específico
const findMonthlyCount = (events: Event[], month: string) => {
	return events.filter((event) => dayjs(event.start).format("YYYY-MM") === month).reduce((count, _) => count + 1, 0)
}

const getFilteredEvents = async (assistance: boolean) => {
	const filter = {
		seniorId: { not: null },
		assistance: { equals: assistance },
		end: { lt: new Date().toISOString() },
	}

	return await prisma.event.findMany({ where: filter, orderBy: { start: "asc" } })
}

const getNotReservedEvents = async () => {
	return await prisma.event.findMany({
		where: { seniorId: null, end: { lt: new Date().toISOString() } },
	})
}
