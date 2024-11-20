import dayjs from "dayjs"

import { Dayjs } from "dayjs"
import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { AppError } from "@repo/lib"
import { Event, Prisma } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

type AssistanceVariants = "assistance" | "absence" | "unreserved"

const isValidReportType = (type: string) => ["general", "byCenter", "byService", "byProfessional"].includes(type)

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

const getBaseEvents = async (filter: Prisma.EventWhereInput) => {
	const assistance = getEventsWith("assistance", filter)
	const absence = getEventsWith("absence", filter)
	const unreserved = getEventsWith("unreserved", filter)

	return await Promise.all([assistance, absence, unreserved])
}

const makeFilter = (date: Dayjs, dateType: "year" | "month", other?: Prisma.EventWhereInput) => {
	return {
		start: { gte: date.startOf(dateType).toISOString() },
		end: { lt: date.endOf(dateType).toISOString() },
		...other,
	}
}

const getGeneralReport = async (date: Dayjs, professionalId?: string) => {
	const professionalFilter = professionalId ? { professionalId } : undefined
	const [assistance, absence, unreserved] = await getBaseEvents(makeFilter(date, "year", professionalFilter))

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
	const centers = await prisma.center.findMany({ select: { name: true, id: true } })

	return await Promise.all(
		centers.map(async (center) => {
			const filter = makeFilter(date, "month", { centerId: center.id })
			const [assistance, absence, unreserved] = await getBaseEvents(filter)

			return {
				center: center.name,
				assistances: assistance.length,
				absences: absence.length,
				unreserved: unreserved.length,
			}
		}),
	)
}

const getByServiceReport = async (date: Dayjs) => {
	const services = await prisma.service.findMany({ select: { name: true, id: true } })

	return await Promise.all(
		services.map(async (service) => {
			const filter = makeFilter(date, "month", { serviceId: service.id })
			const [assistance, absence, unreserved] = await getBaseEvents(filter)

			return {
				service: service.name,
				assistances: assistance.length,
				absences: absence.length,
				unreserved: unreserved.length,
			}
		}),
	)
}

export const generateStatisticReport = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const dateQuery = req.query.date as string
		const reportType = req.query.type as string
		const professionalId = req.query.professionalId as string

		if (!isValidReportType(reportType as string)) {
			throw new AppError(400, "Invalid report type")
		}

		if (reportType === "byProfessional" && !professionalId) {
			throw new AppError(400, "Expected professionalId query parameter")
		}

		const date = match(reportType)
			.with("byCenter", () => dayjs(dateQuery))
			.with("byService", () => dayjs(dateQuery))

			.with("byProfessional", () => dayjs(Number(dateQuery)))
			.with("general", () => dayjs().year(Number(dateQuery)))
			.run()

		const data = await match(reportType)
			.with("byCenter", async () => await getByCenterReport(date))
			.with("byService", async () => await getByServiceReport(date))
			.with("byProfessional", async () => await getGeneralReport(date, professionalId))
			.with("general", async () => await getGeneralReport(date))
			.run()

		res.json({ values: { report: data } })
	} catch (error) {
		next(error)
	}
}
