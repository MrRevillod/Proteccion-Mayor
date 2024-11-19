import dayjs from "dayjs"

import { io } from ".."
import { prisma } from "@repo/database"
import { Senior } from "@prisma/client"
import { AppError } from "@repo/lib"
import { Request, Response, NextFunction } from "express"
import { createEvents, eventsById, formatEvent } from "../utils/events"
import { EventQuery, eventSelect, generateWhere } from "../utils/filters"

// Controlador de tipo select puede recibir un query para seleccionar campos específicos
// y para filtrar por claves foraneas

// Un ejemplo de query sería: /events?select=startsAt,endsAt&professionalId=1

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

		return res.status(200).json({ values: { formatted: formattedEvents, byId: eventsById(events) } })
	} catch (error) {
		next(error)
	}
}

// Controlador para crear un nuevo evento
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { start, end, professionalId, serviceId, centerId, seniorId, repeat } = req.body

		// Se buscan los datos a utilizar con Promise.all
		const [professional, service, senior, center] = await Promise.all([
			prisma.professional.findUnique({ where: { id: professionalId } }),
			prisma.service.findUnique({ where: { id: Number(serviceId) } }),
			seniorId ? prisma.senior.findUnique({ where: { id: seniorId } }) : Promise.resolve(null),
			prisma.center.findUnique({ where: { id: Number(centerId) } }),
		])

		// Se verifica que los datos existan
		if (!professional) throw new AppError(400, "Profesional no encontrado")
		if (!service) throw new AppError(400, "Servicio no encontrado")
		if (seniorId && !senior) throw new AppError(400, "Adulto mayor no encontrado")
		if (!center) throw new AppError(400, "Centro no encontrado")
		if (senior && !senior?.validated) throw new AppError(409, "La persona mayor no está validada")

		const event = {
			start: dayjs(start),
			end: dayjs(end),
			professionalId,
			serviceId: Number(serviceId),
			seniorId: seniorId || null,
			centerId: Number(centerId),
		}

		await createEvents({ ...event, repeat }).catch((error) => {
			throw new AppError(409, error.message)
		})

		io.to("ADMIN").emit("newEvent", null as any)
		return res.status(201).json({ values: { modified: null } })
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un evento por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { seniorId, professionalId, serviceId, centerId, start, end, assistance } = req.body

		// Se buscan los datos a utilizar con Promise.all

		const [professional, service, senior, center] = await Promise.all([
			prisma.professional.findUnique({ where: { id: professionalId } }),
			prisma.service.findUnique({ where: { id: Number(serviceId) } }),
			seniorId ? prisma.senior.findUnique({ where: { id: seniorId } }) : Promise.resolve(null),
			centerId ? prisma.center.findUnique({ where: { id: Number(centerId) } }) : Promise.resolve(null),
		])

		// Se verifica que los datos existan
		if (!professional) throw new AppError(400, "Profesional no encontrado")
		if (!service) throw new AppError(400, "Servicio no encontrado")
		if (seniorId && !senior) throw new AppError(400, "Adulto mayor no encontrado")
		if (centerId && !center) throw new AppError(400, "Centro no encontrado")

		// Convertir las fechas a objetos Date
		const startDate = new Date(start)
		const endDate = new Date(end)

		const orDateSuperposition = {
			start: { lte: endDate },
			end: { gte: startDate },
		}

		// Se buscan eventos donde la id del evento sea diferente a la que se quiere actualizar
		// Y que se superpongan con las fechas del evento a actualizar

		const events = await prisma.event.findMany({
			where: {
				AND: [
					{
						OR: [
							{
								professionalId: professionalId,
								...orDateSuperposition,
							},
							seniorId && {
								seniorId: seniorId,
								...orDateSuperposition,
							},
						],
					},
					{
						id: { not: Number(req.params.id) },
					},
				],
			},
		})

		if (events.length !== 0) throw new AppError(409, "Superposición de horas")

		let event = await prisma.event.update({
			where: { id: Number(req.params.id) },
			data: {
				start: startDate,
				end: endDate,
				professionalId,
				serviceId: Number(serviceId),
				seniorId: seniorId || null,
				centerId: Number(centerId),
				assistance,
			},
			select: eventSelect,
		})

		event = formatEvent(event)

		io.to("ADMIN").emit("updatedEvent", event)
		return res.status(200).json({ values: { modified: event } })
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

// Controlador para reservar un evento desde la aplicación móvil

export const reserveEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Se obtiene el id del evento a reservar y el adulto mayor que lo reserva
		// desde el middleware de autenticación

		const id = req.params.id
		const senior = req.getExtension("user") as Senior

		// Se busca el evento por su id en busca de existencia
		const event = await prisma.event.findUnique({
			where: { id: Number(id) },
		})

		// Si el evento no existe o si ya está reservado por otro adulto mayor
		// se lanza un error 404 o 409 respectivamente

		if (!event) throw new AppError(404, "Evento no encontrado")

		if (event.seniorId) {
			throw new AppError(409, "Este evento ya está reservado")
		}

		// Validación de que la persona mayor no haya reservado el
		// mismo servicio dentro de los 2 meses anteriores.

		// Para ello debemos obtener una fecha 2 meses atrás con respecto a la fecha actual
		const twoMonthsAgo = dayjs().subtract(2, "months").toDate()

		// Y buscar si existe un evento con el mismo servicio y adulto mayor que tenga una
		// ultima actualización (por reserva/asistencia) dentro de los 2 meses anteriores.

		const previousReservation = await prisma.event.findFirst({
			where: {
				seniorId: senior.id,
				serviceId: event.serviceId,
				updatedAt: {
					gte: twoMonthsAgo,
				},
			},
		})

		// Si existe un evento con las condiciones anteriores se lanza un error 409
		// que indica un conflicto con la reserva

		if (previousReservation) {
			throw new AppError(409, "Ya reservaste este servicio en los ultimos 2 meses")
		}

		const updatedEvent = await prisma.event.update({
			where: { id: Number(id) },
			data: { seniorId: senior.id },
		})
		io.to("ADMIN").emit("updatedEvent", formatEvent(updatedEvent))

		return res.status(200).json({ values: updatedEvent })
	} catch (error) {
		next(error)
	}
}

export const cancelReserve = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params

		const senior = req.getExtension("user") as Senior
		const event = await prisma.event.findUnique({
			where: { id: Number(id), seniorId: senior.id },
		})

		if (!event) throw new AppError(404, "Evento no encontrado")

		const updatedEvent = await prisma.event.update({
			where: { id: Number(id) },
			data: {
				seniorId: null,
			},
			select: eventSelect,
		})

		io.to(["ADMIN", updatedEvent.professionalId || ""]).emit("updatedEvent", formatEvent(updatedEvent))
		return res.status(200).json({ modified: formatEvent(updatedEvent) })
	} catch (error) {
		console.log("error cancelReserve", error)
		next(error)
	}
}

export const getByService = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { serviceId } = req.params

		const centers = await prisma.event.findMany({
			where: { serviceId: Number(serviceId), seniorId: null, start: { gte: new Date() } },
			select: {
				center: true,
			},
			distinct: ["centerId"],
		})

		return res.status(200).json({ centers })
	} catch (error) {
		next(error)
	}
}

export const getByServiceCenter = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { serviceId, centerId } = req.params

		const events = await prisma.event.findMany({
			where: { serviceId: Number(serviceId), centerId: Number(centerId), seniorId: null, start: { gte: new Date() } },
			select: eventSelect,
		})

		return res.status(200).json({ events })
	} catch (error) {
		next(error)
	}
}
