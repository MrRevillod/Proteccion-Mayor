import { io } from ".."
import { prisma } from "@repo/database"
import { Senior } from "@prisma/client"
import { AppError } from "@repo/lib"
import { canAddEvent } from "../utils/events"
import { Request, Response, NextFunction } from "express"
import { EventQuery, eventSelect, generateWhere } from "../utils/filters"

// Controlador de tipo select puede recibir un query para seleccionar campos específicos
// y para filtrar por claves foraneas

// Un ejemplo de query sería: /events?select=startsAt,endsAt&professionalId=1

const formatEvent = (event: any) => {
	return {
		...event,
		backgroundColor: event.service.color,
		title: event.service.name,
	}
}

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	// Mapa de query a where
	// Este objecto almacena las claves posibles de la query y su transformación a where
	const queryToWhereMap = {
		professionalId: (value: any) => ({ equals: value }),
		serviceId: (value: any) => ({ equals: Number(value) }),
		centerId: (value: any) => ({ equals: Number(value) }),
		seniorId: (value: any) => (value ? { equals: value } : null),
	}

	// Generamos el where a partir de la query y el mapa
	const where = generateWhere<EventQuery>(req.query, queryToWhereMap, "AND")

	try {
		const events = await prisma.event.findMany({ where, select: eventSelect })
		const formattedEvents = events.map(formatEvent)

		const eventsById = events.reduce((acc: any, event) => {
			acc[event.id] = event
			return acc
		}, {})

		return res.status(200).json({ values: { formatted: formattedEvents, byId: eventsById } })
	} catch (error) {
		next(error)
	}
}

// Controlador para crear un nuevo administrador
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { start, end, professionalId, serviceId, centerId, seniorId } = req.body

		const professional = await prisma.professional.findUnique({
			where: { id: professionalId },
		})

		if (!professional) throw new AppError(400, "Profesional no encontrado")

		const service = await prisma.service.findUnique({
			where: { id: Number(serviceId) },
		})

		if (!service) throw new AppError(400, "Servicio no enconrado")

		if (seniorId) {
			const senior = await prisma.senior.findUnique({
				where: { id: seniorId },
			})

			if (!senior) throw new AppError(400, "Adulto mayor no encontrado")
		}

		const center = await prisma.center.findUnique({
			where: { id: Number(centerId) },
		})

		if (!center) throw new AppError(400, "Centro no encontrado")

		const events = await prisma.event.findMany({
			where: { professionalId: professionalId },
		})

		console.log("body", req.body)
		console.log("events", events)

		if (!canAddEvent(events, { start: new Date(start), end: new Date(end) })) {
			throw new AppError(409, "Superposición de horas", { conflicts: [] })
		}

		const event = await prisma.event.create({
			data: {
				start: new Date(start),
				end: new Date(end),
				professionalId,
				serviceId: Number(serviceId),
				seniorId: seniorId || null,
				centerId: Number(centerId),
			},
			select: {
				id: true,
				start: true,
				end: true,
				assistance: true,
				seniorId: true,
				professionalId: true,
				serviceId: true,
				centerId: true,
				service: {
					select: {
						name: true,
						color: true,
					},
				},
			},
		})

		io.to("ADMIN").emit("newEvent", event as any)
		io.to("anyClientId").emit("newEvent", event as any)

		console.log("event", event)

		return res.status(200).json({ values: { modified: formatEvent(event) } })
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un administrador por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { seniorId, professionalId, serviceId, centerId, start, end, assistance } = req.body

		const professional = await prisma.professional.findUnique({
			where: { id: professionalId },
		})

		if (!professional) {
			throw new AppError(400, "Profesional no encontrado")
		}

		const service = await prisma.service.findUnique({
			where: { id: Number(serviceId) },
		})

		if (!service) {
			throw new AppError(400, "Servicio no encontrado")
		}

		if (seniorId) {
			const senior = await prisma.senior.findUnique({
				where: { id: seniorId },
			})

			if (!senior) {
				throw new AppError(400, "Adulto mayor no encontrado")
			}
		}

		if (centerId) {
			const center = await prisma.center.findUnique({
				where: { id: Number(centerId) },
			})

			if (!center) {
				throw new AppError(400, "Centro no encontrado")
			}
		}
		const events = await prisma.event.findMany({
			where: {
				professionalId: professionalId,
				id: {
					not: Number(req.params.id), // Excluir el evento con el `id` específico
				},
			},
		})

		if (canAddEvent(events, { start: new Date(start), end: new Date(end) })) {
			const event = await prisma.event.update({
				where: { id: Number(req.params.id) },
				data: {
					start: new Date(start),
					end: new Date(end),
					professionalId,
					serviceId: Number(serviceId),
					centerId: centerId ? centerId : null,
					seniorId: seniorId || null,
					assistance: assistance || false,
				},
				select: eventSelect,
			})

			io.to("ADMIN").emit("updatedEvent", formatEvent(event))
			return res.status(200).json({ values: { modified: formatEvent(event) } })
		} else {
			return res.status(409).json({
				message: "Superposición de horas",
				type: "error",
			})
		}
	} catch (error) {
		next(error)
	}
}

// Controlador para eliminar un administrador por su id
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const event = await prisma.event.delete({ where: { id: Number(req.params.id) }, select: eventSelect })
		io.emit("deletedEvent", formatEvent(event))
		return res.status(200).json({ values: { modified: formatEvent(event) } })
	} catch (error) {
		next(error)
	}
}

export const reserveEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params

		const senior = req.getExtension("user") as Senior

		const event = await prisma.event.findUnique({
			where: { id: Number(id) },
		})

		if (!event) throw new AppError(404, "Evento no encontrado")

		const twoMonthsAgo = new Date()
		twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

		const previousReservation = await prisma.event.findFirst({
			where: {
				seniorId: senior.id,
				serviceId: event.serviceId,
				updatedAt: {
					gte: twoMonthsAgo,
				},
			},
		})

		if (previousReservation) {
			throw new AppError(409, "Ya reservaste este servicio en los ultimos 2 meses")
		}

		if (event.seniorId) {
			throw new AppError(409, "Este evento ya está reservado")
		}

		const updatedEvent = await prisma.event.update({
			where: { id: Number(id) },
			data: {
				seniorId: senior.id,
			},
		})

		return res.status(200).json({ values: updatedEvent })
	} catch (error) {
		next(error)
	}
}

export const cancelReserve = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params

		// const senior = req.getExtension("user") as Senior

		// const event = await prisma.event.findUnique({
		// 	where: { id: Number(id), seniorId: senior.id },
		// })

		// if (!event) throw new AppError(404, "Evento no encontrado")/

		const updatedEvent = await prisma.event.update({
			where: { id: Number(id) },
			data: {
				seniorId: null,
			},
		})

		io.to("ADMIN").emit("updatedEvent", formatEvent(updatedEvent))
		return res.status(200).json({ modified: formatEvent(updatedEvent) })
	} catch (error) {
		next(error)
	}
}
