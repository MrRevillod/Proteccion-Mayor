import { io } from ".."
import { prisma } from "@repo/database"
import { Senior } from "@prisma/client"
import { AppError } from "@repo/lib"
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

		const eventsById = events.reduce((acc: any, event) => {
			acc[event.id] = event
			return acc
		}, {})

		const formattedEvents = events.map(formatEvent)

		return res.status(200).json({ values: { formatted: formattedEvents, byId: eventsById } })
	} catch (error) {
		console.log(error)
		next(error)
	}
}

// Controlador para crear un nuevo evento
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { start, end, professionalId, serviceId, centerId, seniorId } = req.body

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

		// Convertir las fechas a objetos Date
		const startDate = new Date(start)
		const endDate = new Date(end)

		const orDateSuperposition = {
			start: { lte: endDate },
			end: { gte: startDate },
		}

		const events = await prisma.event.findMany({
			where: {
				OR: [
					{
						professionalId: professionalId,
						OR: [orDateSuperposition],
					},
					seniorId && {
						seniorId: seniorId,
						OR: [orDateSuperposition],
					},
				],
			},
		})

		if (events.length > 0) throw new AppError(409, "Superposición de horas")

		let event = await prisma.event.create({
			data: {
				start: startDate,
				end: endDate,
				professionalId,
				serviceId: Number(serviceId),
				seniorId: seniorId || null,
				centerId: Number(centerId),
			},
			select: eventSelect,
		})

		event = formatEvent(event)

		io.to("ADMIN").emit("newEvent", event)

		return res.status(201).json({ values: { modified: event } })
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

export const getByService = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { serviceId } = req.params

		const centers = await prisma.event.findMany({
			where: { serviceId: Number(serviceId) },
			select: {
				center: true,
			},
			distinct: ["centerId"],
		})

		console.log(centers)

		return res.status(200).json({ centers })
	} catch (error) {
		next(error)
	}
}
