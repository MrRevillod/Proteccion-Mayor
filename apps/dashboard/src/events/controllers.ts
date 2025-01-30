import dayjs from "dayjs"

import { io } from ".."
import { prisma } from "@repo/database"
import { EventService } from "./service"
import { Prisma, Senior, Event } from "@prisma/client"
import { EventsSchemas, WeeklyEvents } from "./schemas"
import { AppError, Controller, MailerService, templates } from "@repo/lib"

export class EventsController {
	constructor(
		private schemas: EventsSchemas,
		private mailer: MailerService,
		private service: EventService = new EventService(),
	) {}

	/**
	 * Controlador para obtener un listado de eventos y un objeto con los eventos
	 * formateados por id
	 *
	 * @param req (Express Request)
	 * @param res (Express Response)
	 * @param handleError (Express NextFunction)
	 *
	 * @returns (Express Response)
	 * @throws (AppError)
	 */

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const query = this.schemas.query.parse(req.query)
			const andConditions: Prisma.EventWhereInput[] = []

			if (query.professionalId) {
				andConditions.push({ professionalId: { equals: query.professionalId } })
			}

			if (query.serviceId) {
				andConditions.push({ serviceId: { equals: query.serviceId } })
			}

			if (query.centerId) {
				andConditions.push({ centerId: { equals: query.centerId } })
			}

			if (query.seniorId) {
				andConditions.push({ seniorId: { equals: query.seniorId } })
			}

			if (query.start && query.end) {
				andConditions.push({
					start: { gte: dayjs(query.start).startOf("day").toDate() },
					end: { lte: dayjs(query.end).endOf("day").toDate() },
				})
			}

			const data = await prisma.event.findMany({
				select: this.schemas.defaultSelect,
				where: {
					AND: andConditions,
				},
			})

			const events = this.service.format(data, [])

			return res.status(200).json({
				values: { formatted: events.formatted, byId: events.byId },
			})
		} catch (error) {
			handleError(error)
		}
	}

	public createOne: Controller = async (req, res, handleError) => {
		const { start, end, professionalId, serviceId, centerId, seniorId } = req.body

		try {
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

			const event: Partial<Event> = {
				start: dayjs(start).toDate(),
				end: dayjs(end).toDate(),
				professionalId,
				serviceId: Number(serviceId),
				seniorId: seniorId ?? null,
				centerId: Number(centerId),
			}

			await this.service.validareRestrictions(event)

			await prisma.event.create({
				data: {
					start: event?.start?.toISOString() as string,
					end: event?.end?.toISOString() as string,
					professionalId: event.professionalId,
					serviceId: event.serviceId,
					seniorId: event.seniorId,
					centerId: event.centerId,
					assistance: false,
				},
			})

			io.to("ADMIN").emit("event:create", null)
			io.to(professionalId as string).emit("event:create", null)

			return res.status(201).json({ values: { modified: null } })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Controlador para crear los eventos correspondientes a una semana
	 * @param req (Express Request)
	 * @param res (Express Response)
	 * @param handleError (Express NextFunction)
	 *
	 * @returns (Express Response)
	 * @throws (AppError)
	 */

	public createMany: Controller = async (req, res, handleError) => {
		const { query, body } = req

		const { weeklyEvents, start, end } = body as WeeklyEvents
		const { serviceId, professionalId } = query

		try {
			const [professional, service] = await Promise.all([
				prisma.professional.findUnique({ where: { id: professionalId?.toString() } }),
				prisma.service.findUnique({ where: { id: Number(serviceId) } }),
			])

			if (!professional || !service) {
				throw new AppError(400, "Profesional o servicio no encontrado")
			}

			const orDateSuperposition = {
				start: { lte: dayjs(end).toDate() },
				end: { gte: dayjs(start).toDate() },
			}

			const events = await prisma.event.findMany({
				where: {
					professionalId: professionalId?.toString(),
					OR: [orDateSuperposition],
				},
			})

			if (events.length !== 0) {
				throw new AppError(409, "El profesional ya tiene eventos en el rango de fechas")
			}

			Object.keys(weeklyEvents).forEach((day) => {
				const dayDate = dayjs(day)

				const centerId = weeklyEvents[day]["centerId"]
				const events = weeklyEvents[day]["events"]

				events.forEach(async (event) => {
					const { start, end } = event
					const [startHH, startMM] = this.service.splitTime(start)
					const [endHH, endMM] = this.service.splitTime(end)

					const startDate = dayDate.hour(startHH).minute(startMM)
					const endDate = dayDate.hour(endHH).minute(endMM)

					await prisma.event.create({
						data: {
							start: startDate.toISOString(),
							end: endDate.toISOString(),
							professionalId: professionalId?.toString(),
							serviceId: Number(serviceId),
							centerId: Number(centerId),
							assistance: false,
						},
					})
				})
			})

			io.to("ADMIN").emit("event:create", null)
			io.to("FUNCTIONARY").emit("event:create", null)
			io.to(professionalId as string).emit("event:create", null)

			return res.status(201).json({ values: { modified: null } })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Controlador para actualizar un Evento por su id
	 * @param req (Express Request)
	 * @param res (Express Response)
	 * @param handleError (Express NextFunction)
	 *
	 * @returns (Express Response)
	 * @throws (AppError)
	 */

	public updateOne: Controller = async (req, res, handleError) => {
		const { id } = req.params
		const { seniorId, professionalId, serviceId, centerId, start, end, assistance } = req.body

		try {
			const [professional, service, senior, center, eventExists] = await Promise.all([
				prisma.professional.findUnique({ where: { id: professionalId } }),
				prisma.service.findUnique({ where: { id: Number(serviceId) } }),
				seniorId ? prisma.senior.findUnique({ where: { id: seniorId } }) : Promise.resolve(null),
				centerId ? prisma.center.findUnique({ where: { id: Number(centerId) } }) : Promise.resolve(null),
				prisma.event.findUnique({ where: { id: id } }),
			])

			// Se verifica que los datos existan
			if (!professional) throw new AppError(400, "Profesional no encontrado")
			if (!service) throw new AppError(400, "Servicio no encontrado")
			if (seniorId && !senior) throw new AppError(400, "Adulto mayor no encontrado")
			if (centerId && !center) throw new AppError(400, "Centro no encontrado")

			if (!eventExists) throw new AppError(400, "Evento no encontrado")

			const eventExistsChange = eventExists.assistance !== assistance

			if (eventExistsChange && dayjs().isAfter(dayjs(eventExists.end).add(3, "days"))) {
				throw new AppError(
					400,
					"No se puede autorizar la asistencia después de 3 días de la finalización del evento",
				)
			}

			const startDate = new Date(start)
			const endDate = new Date(end)

			const orDateSuperposition = {
				start: { lt: endDate },
				end: { gt: startDate },
			}

			const events = await prisma.event.findMany({
				where: {
					id: { not: id },
					OR: [
						{
							professionalId,
							...orDateSuperposition,
						},
						{
							seniorId,
							...orDateSuperposition,
						},
					],
				},
			})

			if (events.length !== 0) throw new AppError(409, "Superposición de horas")

			let event = await prisma.event.update({
				where: { id: id },
				data: {
					start: startDate,
					end: endDate,
					professionalId,
					serviceId: Number(serviceId),
					seniorId: seniorId ?? null,
					centerId: Number(centerId),
					assistance,
				},
				select: this.schemas.defaultSelect,
			})

			event = this.service.singleFormat(event)

			io.to("ADMIN").emit("event:update", event)
			io.to(event.professionalId as string).emit("event:update", event)

			return res.status(200).json({ values: { modified: event } })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Controlador para eliminar un Evento por su id
	 * @param req (Express Request)
	 * @param res (Express Response)
	 * @param handleError (Express NextFunction)
	 *
	 * @returns (Express Response)
	 * @throws (AppError)
	 */

	public deleteOne: Controller = async (req, res, handleError) => {
		const { params } = req

		try {
			const event = await prisma.event.delete({
				where: { id: params.id },
				select: this.schemas.defaultSelect,
			})

			const formatted = this.service.singleFormat(event)

			io.to("ADMIN").emit("event:delete", formatted)
			io.to("FUNCTIONARY").emit("event:delete", formatted)

			io.to(event.professionalId as string).emit("event:delete", formatted)

			return res.status(200).json({ values: { modified: formatted } })
		} catch (error) {
			handleError(error)
		}
	}

	public createReservation: Controller = async (req, res, handleError) => {
		const { params, getExtension } = req

		const senior = getExtension("user") as Senior

		try {
			// Validar existencia del evento solicitado
			const event = await prisma.event.findUnique({
				where: { id: params.id },
				select: this.schemas.defaultSelect,
			})

			if (!event) throw new AppError(404, "Evento no encontrado")
			if (event.seniorId) throw new AppError(409, "Este evento ya está reservado")

			if (!event.center) throw new AppError(404, "Centro no encontrado")
			if (!event.service) throw new AppError(404, "Servicio no encontrado")
			if (!event.professional) throw new AppError(404, "Professional no encontrado")

			// Validación de que la persona mayor no haya reservado el
			// mismo servicio dentro de los 2 meses anteriores. Para ello debemos
			// obtener una fecha 2 meses atrás con respecto a la fecha actual

			const twoMonthsAgo = dayjs().subtract(2, "months").toDate()

			// Y buscar si existe un evento con el mismo servicio y adulto mayor que tenga una
			// ultima actualización (por reserva/asistencia) dentro de los 2 meses anteriores.

			const condition = {
				AND: [{ seniorId: senior.id }, { serviceId: event.service.id }, { updatedAt: { gte: twoMonthsAgo } }],
			}

			const previousReservation = await prisma.event.findFirst({
				where: condition,
				select: this.schemas.defaultSelect,
			})

			// Si existe un evento con las condiciones anteriores se lanza un error 409
			// que indica un conflicto con la reserva

			if (previousReservation) {
				throw new AppError(409, "Ya reservaste este servicio en los ultimos 2 meses")
			}

			const updatedEvent = await prisma.event.update({
				where: { id: params.id },
				data: { seniorId: senior.id },
				select: this.schemas.defaultSelect,
			})

			const { professionalTemplate, seniorTemplate } = templates.reservation(updatedEvent)

			this.mailer.send({
				to: event.professional.email,
				subject: `Cita de ${event.service.name} reservada`,
				html: professionalTemplate,
			})

			this.mailer.send({
				to: senior.email as string,
				subject: `Reserva de ${event.service.name} confirmada`,
				html: seniorTemplate,
			})

			const formatted = this.service.singleFormat(updatedEvent)

			io.to("ADMIN").emit("event:update", formatted)
			io.to(event.professionalId as string).emit("event:update", formatted)

			return res.status(200).json({ values: updatedEvent })
		} catch (error) {
			handleError(error)
		}
	}

	public cancelReservation: Controller = async (req, res, handleError) => {
		const { params, getExtension } = req

		const senior = getExtension("user") as Senior

		try {
			const event = await prisma.event.findUnique({
				select: this.schemas.defaultSelect,
				where: { id: params.id, seniorId: senior.id },
			})

			if (!event) throw new AppError(404, "Evento no encontrado")

			const updated = await prisma.event.update({
				where: { id: params.id },
				data: { seniorId: null },
				select: this.schemas.defaultSelect,
			})

			const { professionalTemplate, seniorTemplate } = templates.cancelReservation(event)

			this.mailer.send({
				to: event?.professional?.email ?? "",
				subject: `Cita de ${event?.service?.name} cancelada`,
				html: professionalTemplate,
			})

			this.mailer.send({
				to: senior.email as string,
				subject: `Reserva de ${event.service?.name} cancelada`,
				html: seniorTemplate,
			})

			const formatted = this.service.singleFormat(updated)

			io.to("ADMIN").emit("event:update", formatted)
			io.to(event.professionalId as string).emit("event:update", formatted)

			return res.status(200).json({ values: formatted })
		} catch (error) {
			handleError(error)
		}
	}

	public getCentersByService: Controller = async (req, res, handleError) => {
		const user = req.getExtension("user") as Senior
		const serviceId = req.params.serviceId

		const twoMonthsAgo = dayjs().subtract(2, "months").toDate()

		try {
			const previousReservation = await prisma.event.findFirst({
				select: this.schemas.defaultSelect,
				where: {
					AND: [
						{ seniorId: user.id },
						{ serviceId: Number(serviceId) },
						{ updatedAt: { gte: twoMonthsAgo } },
					],
				},
			})

			if (previousReservation) {
				throw new AppError(409, "Ya reservaste este servicio en los ultimos 2 meses")
			}

			const centers = await prisma.event.findMany({
				distinct: ["centerId"],
				select: { center: true },
				where: {
					serviceId: Number(serviceId),
					seniorId: null,
					start: { gte: new Date() },
				},
			})

			const formatCenters = centers.map((event) => event.center)

			return res.status(200).json({ centers, values: formatCenters })
		} catch (error) {
			handleError(error)
		}
	}

	public getAvailableDates: Controller = async (req, res, handleError) => {
		const { serviceId, centerId } = req.query

		try {
			const dates = await prisma.event
				.findMany({
					where: {
						centerId: Number(centerId),
						serviceId: Number(serviceId),
						seniorId: null,
						start: { gte: new Date() },
					},
					select: { start: true },
				})
				.then((events) => events.map((event) => dayjs(event.start).format("YYYY-MM-DD")))

			return res.status(200).json({ values: dates })
		} catch (error) {
			handleError(error)
		}
	}

	public getEventsByDate: Controller = async (req, res, handleError) => {
		const { date, serviceId, centerId } = req.query as any

		const startDate = dayjs(date).startOf("day").toDate()
		const endDate = dayjs(date).endOf("day").toDate()

		try {
			const events = await prisma.event.findMany({
				select: this.schemas.defaultSelect,
				where: {
					centerId: Number(centerId),
					serviceId: Number(serviceId),
					seniorId: null,
					start: { gte: startDate, lte: endDate },
				},
			})

			return res.status(200).json({ values: events })
		} catch (error) {
			handleError(error)
		}
	}

	public checkWeekAvailability: Controller = async (req, res, handleError) => {
		const { professionalId, start, end } = req.query

		try {
			const orDateSuperposition = {
				start: { lte: dayjs(end as string).toDate() },
				end: { gte: dayjs(start as string).toDate() },
			}

			const events = await prisma.event.findMany({
				where: {
					professionalId: professionalId?.toString(),
					OR: [orDateSuperposition],
				},
			})

			if (events.length !== 0) {
				throw new AppError(409, "El profesional ya tiene eventos en el rango de fechas")
			}

			return res.status(200).json({ values: { available: true } })
		} catch (error) {
			handleError(error)
		}
	}
}
