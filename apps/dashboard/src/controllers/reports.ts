import { NextFunction, Request, Response } from "express"
import { getEventsByAssistance, reduceFunction } from "../utils/reports"

type FormattedDateCount = {
	date: string
	count: number
}

export const generateGeneralReport = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const assistanceEvents = await getEventsByAssistance(true)
		const formattedAssistanceEvents = [] as FormattedDateCount[]

		assistanceEvents.reduce((acc, event) => {
			return reduceFunction(acc, event)
		}, formattedAssistanceEvents)

		const noAssistanceEvents = await getEventsByAssistance(false)
		const formattedNoAssistanceEvents = [] as FormattedDateCount[]

		noAssistanceEvents.reduce((acc, event) => {
			return reduceFunction(acc, event)
		}, formattedNoAssistanceEvents)

		return res.status(200).json({ values: { formattedAssistanceEvents, formattedNoAssistanceEvents } })
	} catch (error) {
		next(error)
	}
}

/* export const getConcurrenceByCenters = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const concurrencia = await prisma.event.groupBy({
			by: ["centerId", "assistance"],
			_count: {
				id: true,
			},
			orderBy: {
				centerId: "asc",
			},
		})

		const reportData = await Promise.all(
			concurrencia.map(async (evento) => {
				let centerName = "Centro desconocido"

				if (evento.centerId !== null) {
					const center = await prisma.center.findUnique({
						where: { id: evento.centerId },
					})
					centerName = center?.name || centerName
				}

				return {
					centerName,
					assistance: evento.assistance,
					count: evento._count.id,
				}
			}),
		)

		res.json(reportData)
	} catch (error) {
		next(error)
	}
}

export const getConcurrenceByService = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const concurrencia = await prisma.event.groupBy({
			by: ["serviceId", "assistance"],
			_count: {
				id: true,
			},
			orderBy: {
				serviceId: "asc",
			},
		})

		const reportData = await Promise.all(
			concurrencia.map(async (evento) => {
				let serviceName = "Centro desconocido"

				if (evento.serviceId !== null) {
					const service = await prisma.service.findUnique({
						where: { id: evento.serviceId },
					})
					serviceName = service?.name || serviceName
				}

				return {
					serviceName,
					assistance: evento.assistance,
					count: evento._count.id,
				}
			}),
		)

		res.json(reportData)
	} catch (error) {
		next(error)
	}
}
 */
