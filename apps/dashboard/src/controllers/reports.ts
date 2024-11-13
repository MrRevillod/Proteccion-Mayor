import dayjs from "dayjs"

import { Dayjs } from "dayjs"
import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { AppError } from "@repo/lib"
import { Event, Prisma } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

type AssistanceVariants = "assistance" | "absence" | "unreserved"

const isValidReportType = (type: string) => ["general", "byCenter", "byService"].includes(type)

const genMonthsArray = (year: number) => {
	return Array.from({ length: 12 }, (_, i) => dayjs().year(year).month(i).format("YYYY-MM"))
}

const getEventsWith = async (variant: AssistanceVariants, other?: Prisma.EventWhereInput) => {
	let filter: Prisma.EventWhereInput = { end: { lt: new Date().toISOString() } }

	match(variant)
		.with("assistance", () => {
			filter["seniorId"] = { not: null }
			filter["assistance"] = { equals: true }
		})
		.with("absence", () => {
			filter["seniorId"] = { not: null }
			filter["assistance"] = { equals: false }
		})
		.with("unreserved", () => {
			filter["seniorId"] = { equals: null }
		})
		.run()

	if (other) filter = { ...filter, ...other }

	return await prisma.event.findMany({
		where: filter,
		orderBy: { start: "asc" },
		include: { center: true, service: true },
	})
}

const getMonthlyEventCount = (events: Event[], month: string) => {
	return events.filter((event) => dayjs(event.start).format("YYYY-MM") === month).reduce((count, _) => count + 1, 0)
}

const getBaseEvents = async (date: Dayjs, filter: Prisma.EventWhereInput) => {
	return await Promise.all([getEventsWith("assistance", filter), getEventsWith("absence", filter), getEventsWith("unreserved", filter)])
}

const yearFilter = (date: Dayjs) => {
	return {
		start: { gte: date.startOf("year").toISOString() },
		end: { lt: date.endOf("year").toISOString() },
	}
}

const monthFilter = (date: Dayjs) => {
	return {
		start: { gte: date.startOf("month").toISOString() },
		end: { lt: date.endOf("month").toISOString() },
	}
}

const getGeneralReport = async (date: Dayjs) => {
	const [assistance, absence, unreserved] = await getBaseEvents(date, yearFilter(date))
	const months = genMonthsArray(date.year())

	return months.map((month) => {
		return {
			month,
			assistances: getMonthlyEventCount(assistance, month),
			absences: getMonthlyEventCount(absence, month),
			unreserved: getMonthlyEventCount(unreserved, month),
		}
	})
}

const getByCenterReport = async (date: Dayjs) => {
	const [assistance, absence, unreserved] = await getBaseEvents(date, monthFilter(date))
	const centers = await prisma.center.findMany({ select: { name: true, id: true } })

	return centers.map((center, index) => {
		const centerAssistance = assistance.filter((event) => event.centerId === center.id)
		const centerAbsence = absence.filter((event) => event.centerId === center.id)
		const centerUnreserved = unreserved.filter((event) => event.centerId === center.id)

		return {
			center: `${index + 1}. ${center.name}`,
			assistances: centerAssistance.length,
			absences: centerAbsence.length,
			unreserved: centerUnreserved.length,
		}
	})
}

const getByServiceReport = async (date: Dayjs) => {
	const [assistance, absence, unreserved] = await getBaseEvents(date, monthFilter(date))
	const services = await prisma.service.findMany({ select: { name: true, id: true } })

	return services.map((service, index) => {
		const serviceAssistance = assistance.filter((event) => event.serviceId === service.id)
		const serviceAbsence = absence.filter((event) => event.serviceId === service.id)
		const serviceUnreserved = unreserved.filter((event) => event.serviceId === service.id)

		return {
			service: service.name,
			assistances: serviceAssistance.length,
			absences: serviceAbsence.length,
			unreserved: serviceUnreserved.length,
		}
	})
}

export const generateStatisticReport = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const dateQuery = req.query.date as string
		const reportType = req.query.type as string

		if (!isValidReportType(reportType as string)) {
			throw new AppError(400, "Invalid report type")
		}

		const date = match(reportType)
			.with("byCenter", () => dayjs(dateQuery))
			.with("byService", () => dayjs(dateQuery))
			.with("general", () => dayjs().year(Number(dateQuery)))
			.run()

		const data = await match(reportType)
			.with("general", async () => await getGeneralReport(date))
			.with("byCenter", async () => await getByCenterReport(date))
			.with("byService", async () => await getByServiceReport(date))
			.run()

		res.json({ values: { report: data, numbers: {} } })
	} catch (error) {
		next(error)
	}
}
