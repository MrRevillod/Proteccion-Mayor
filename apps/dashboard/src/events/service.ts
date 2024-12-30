import { prisma } from "@repo/database"
import { AppError } from "@repo/lib"
import { Dayjs } from "dayjs"
import { match } from "ts-pattern"

type RepeatValues = "daily" | "weekly"

type CreateEventData = {
	start: Dayjs
	end: Dayjs
	professionalId: string
	serviceId: number
	seniorId: string
	centerId: number
	repeat: RepeatValues
}

type HasOverlapProps = {
	startDate: Dayjs
	endDate: Dayjs
	professionalId: string
	seniorId?: string
}

type EventOverlapWhere = {
	OR: {
		professionalId?: string
		seniorId?: string
		OR: { start: { lte: Date }; end: { gte: Date } }[]
	}[]
}

export class EventService {
	constructor() {}

	public singleFormat = (event: any) => {
		return {
			...event,
			title: event.service.name,
			backgroundColor: event.service.color,
		}
	}

	public format = (events: any[]) => {
		const byId: Record<string, any> = {}
		const formatted = new Array<any>()

		for (const event of events) {
			const formattedEvent = this.singleFormat(event)
			byId[event.id as string] = formattedEvent
			formatted.push(formattedEvent)
		}

		return { byId, formatted }
	}

	public createEvents = async (data: CreateEventData) => {
		const { start, end, professionalId, serviceId, seniorId, centerId, repeat } = data

		const createConcurrentEvents = async (interval: "day" | "week", count: number) => {
			let eventCount = 0
			let current = start

			const startMonth = start.month()
			const startYear = start.year()

			while (eventCount < count) {
				if (current.month() !== startMonth || current.year() !== startYear) {
					break
				}

				if (current.day() !== 0 && current.day() !== 6) {
					await this.createEvent({
						start: current,
						end: current.add(end.diff(start, "minute"), "minute"),
						professionalId,
						serviceId,
						seniorId,
						centerId,
						repeat,
					})
					eventCount++
				}

				current = interval === "week" ? current.add(1, "week") : current.add(1, "day")
			}
		}

		await match(repeat)
			.with("daily", async () => createConcurrentEvents("day", 30))
			.with("weekly", async () => createConcurrentEvents("day", 5))
			.otherwise(async () => {
				await this.createEvent({
					start,
					end,
					professionalId,
					serviceId,
					seniorId,
					centerId,
					repeat,
				})
			})
	}

	// Función que se encarga de crear un evento en la base de datos

	private createEvent = async (data: CreateEventData) => {
		const { start, end, professionalId, serviceId, seniorId, centerId, repeat } = data

		const weekend = start.day() === 0 || end.day() === 6

		if (weekend) {
			throw new AppError(400, "No es posible crear eventos los fin de semana")
		}

		// Se verifica si hay superposición de eventos

		const overlap = await this.hasOverlap({
			startDate: start,
			endDate: end,
			professionalId,
			seniorId,
		})

		// Si hay superposición de eventos y no hay repetición, se lanza un error
		// ya que el evento que se quiere crear se superpone con otro evento

		if (overlap && !repeat) throw Error("Superposición de horas")

		// Si no hay superposición de eventos, se crea el evento en la base de datos

		if (!overlap) {
			await prisma.event.create({
				data: {
					start: start.toDate(),
					end: end.toDate(),
					professionalId,
					serviceId: Number(serviceId),
					seniorId: seniorId || null,
					centerId: Number(centerId),
				},
			})
		}

		// Si hay superposición y hay repetición, se salta la creación del evento
		// ya que se prioriza la creación de eventos que no se superpongan
	}

	// Función que verifica si hay superposición de eventos en una fecha y hora determinada
	// para un profesional o un adulto mayor dados

	public hasOverlap = async ({
		startDate,
		endDate,
		...props
	}: HasOverlapProps): Promise<boolean> => {
		const { professionalId, seniorId } = props

		// Para verificar si hay superposición de eventos, se busca en la base de datos
		// si hay eventos donde la fecha de inicio sea menor o igual a la fecha de término
		// y la fecha de término sea mayor o igual a la fecha de inicio

		const orDateSuperposition = {
			start: { lte: endDate.toDate() },
			end: { gte: startDate.toDate() },
		}

		// Se crea un objeto con las condiciones de superposición de fechas
		// de profesionales y adultos mayores

		const eventWhere: EventOverlapWhere = {
			OR: [{ professionalId, OR: [orDateSuperposition] }],
		}

		if (seniorId) eventWhere.OR.push({ seniorId, OR: [orDateSuperposition] })

		// Se buscan eventos que cumplan con las condiciones de superposición
		// y se retorna si hay eventos que cumplan con esas condiciones

		const events = await prisma.event.findMany({
			where: eventWhere,
		})

		return events.length !== 0
	}
}
