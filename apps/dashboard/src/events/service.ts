import dayjs, { Dayjs } from "dayjs"

import { prisma } from "@repo/database"
import { Event } from "@prisma/client"
import { BadRequest } from "@repo/lib"

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

	public splitTime = (time: string) => time.split(":").map((t) => Number(t))

	public singleFormat = (event: any) => {
		return {
			...event,
			title: event.service.name,
			backgroundColor: event.service.color,
		}
	}

	public singleFormatOperative = (operative: any) => {
		return {
			...operative,
			title: operative.name,
			backgroundColor: "#4260f5",
		}
	}

	public format = (events: any[], operatives: any[]) => {
		const byId: Record<string, any> = {}
		const formatted = new Array<any>()
		if (events) {
			for (const event of events) {
				const formattedEvent = this.singleFormat(event)
				byId[event.id as string] = formattedEvent
				formatted.push(formattedEvent)
			}
		}

		if (operatives) {
			for (const operative of operatives) {
				const formattedOperative = this.singleFormatOperative(operative)
				byId[operative.id as string] = formattedOperative
				formatted.push(formattedOperative)
			}
		}
		return { byId, formatted }
	}

	// Función que verifica si hay superposición de eventos en una fecha y hora determinada
	// para un profesional o un adulto mayor dados

	public hasOverlap = async (event: Partial<Event>) => {
		// Para verificar si hay superposición de eventos, se busca en la base de datos
		// si hay eventos donde la fecha de inicio sea menor o igual a la fecha de término
		// y la fecha de término sea mayor o igual a la fecha de inicio

		const orDateSuperposition = {
			start: { lte: dayjs(event.end).toDate() },
			end: { gte: dayjs(event.start).toDate() },
		}

		// Se crea un objeto con las condiciones de superposición de fechas
		// de profesionales y adultos mayores

		const eventWhere: EventOverlapWhere = {
			OR: [
				{
					professionalId: event?.professionalId as string,
					OR: [orDateSuperposition],
				},
			],
		}

		if (event.seniorId) eventWhere.OR.push({ seniorId: event.seniorId, OR: [orDateSuperposition] })

		// Se buscan eventos que cumplan con las condiciones de superposición
		// y se retorna si hay eventos que cumplan con esas condiciones

		const events = await prisma.event.findMany({
			where: eventWhere,
		})

		return events.length !== 0
	}

	public validareRestrictions = async (event: Partial<Event>) => {
		const startDate = dayjs(event?.start)
		const endDate = dayjs(event?.end)

		if (startDate.isAfter(endDate)) {
			throw new BadRequest("La fecha de inicio no puede ser mayor a la fecha de término")
		}

		if (startDate.isBefore(dayjs()) || endDate.isBefore(dayjs())) {
			throw new BadRequest("El evento no puede ser creado en el pasado")
		}

		if (startDate.isSame(endDate)) {
			throw new BadRequest("El evento debe tener una duración mayor a 0")
		}

		if (endDate.diff(startDate, "hours") > 3) {
			throw new BadRequest("El evento no puede durar más de 3 horas")
		}

		if (await this.hasOverlap(event)) {
			throw new BadRequest("El evento tiene superposición con otro evento")
		}
	}
}
