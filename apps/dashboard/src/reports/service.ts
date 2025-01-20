import dayjs from "dayjs"

import { Dayjs } from "dayjs"
import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { Event, Prisma } from "@prisma/client"

type AssistanceVariants = "assistance" | "absence" | "unreserved"

export class ReportsService {
	public isValidReportType = (type: string) => {
		return ["general", "byCenter", "byService", "byProfessional"].includes(type)
	}

	private genMonthsArray = (year: number) => {
		return Array.from({ length: 12 }, (_, i) => dayjs().year(year).month(i).format("YYYY-MM"))
	}

	private getEventsWith = async (variant: AssistanceVariants, other?: Prisma.EventWhereInput) => {
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

	private getMonthlyEventCount = (events: Event[], month: string) => {
		return events
			.filter((event) => dayjs(event.start).format("YYYY-MM") === month)
			.reduce((count, _) => count + 1, 0)
	}

	private getBaseEvents = async (filter: Prisma.EventWhereInput) => {
		const assistance = this.getEventsWith("assistance", filter)
		const absence = this.getEventsWith("absence", filter)
		const unreserved = this.getEventsWith("unreserved", filter)

		return await Promise.all([assistance, absence, unreserved])
	}

	private makeFilter = (
		date: Dayjs,
		dateType: "year" | "month",
		other?: Prisma.EventWhereInput,
	) => {
		return {
			start: { gte: date.startOf(dateType).toISOString() },
			end: { lt: date.endOf(dateType).toISOString() },
			...other,
		}
	}

	public getGeneralReport = async (date: Dayjs, professionalId?: string) => {
		const professionalFilter = professionalId
			? { professionalId: { equals: professionalId } }
			: undefined
		const [assistance, absence, unreserved] = await this.getBaseEvents(
			this.makeFilter(date, "year", professionalFilter),
		)
		const months = this.genMonthsArray(date.year())

		return months.map((month) => {
			return {
				month,
				assistances: this.getMonthlyEventCount(assistance, month),
				absences: this.getMonthlyEventCount(absence, month),
				unreserved: this.getMonthlyEventCount(unreserved, month),
			}
		})
	}
w
	public getByCenterReport = async (date: Dayjs) => {
		const centers = await prisma.center.findMany({ select: { name: true, id: true } })

		return await Promise.all(
			centers.map(async (center) => {
				const filter = this.makeFilter(date, "month", { centerId: center.id })
				const [assistance, absence, unreserved] = await this.getBaseEvents(filter)

				return {
					center: center.name,
					assistances: assistance.length,
					absences: absence.length,
					unreserved: unreserved.length,
				}
			}),
		)
	}

	public getByServiceReport = async (date: Dayjs) => {
		const services = await prisma.service.findMany({ select: { name: true, id: true } })

		return await Promise.all(
			services.map(async (service) => {
				const filter = this.makeFilter(date, "month", { serviceId: service.id })
				const [assistance, absence, unreserved] = await this.getBaseEvents(filter)

				return {
					service: service.name,
					assistances: assistance.length,
					absences: absence.length,
					unreserved: unreserved.length,
				}
			}),
		)
	}
}
