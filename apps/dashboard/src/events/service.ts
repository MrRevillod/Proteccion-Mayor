import { Dayjs } from "dayjs"
import { prisma } from "@repo/database"

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

	public hasOverlap = async ({ startDate, endDate, ...props }: HasOverlapProps): Promise<boolean> => {
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
