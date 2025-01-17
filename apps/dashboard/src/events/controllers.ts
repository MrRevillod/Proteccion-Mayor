import dayjs from "dayjs"

import { io } from ".."
import { prisma } from "@repo/database"
import { Senior } from "@prisma/client"
import { EventService } from "./service"
import { EventsSchemas } from "./schemas"
import { AppError, Controller, MailerService, templates } from "@repo/lib"

export class EventsController {
	constructor(
		private schemas: EventsSchemas,
		private mailer: MailerService,
		private service: EventService = new EventService(),
	) {}

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const query = this.schemas.query.parse(req.query)
			const data = await prisma.event.findMany({
				select: this.schemas.defaultSelect,
				where: {
					professionalId: query.professionalId
						? { equals: query.professionalId }
						: undefined,
					serviceId: query.serviceId ? { equals: query.serviceId } : undefined,
					centerId: query.centerId ? { equals: Number(query.centerId) } : undefined,
					seniorId: query.seniorId ? { equals: query.seniorId } : undefined,
				},
			})

			const events = this.service.format(data)

			return res.status(200).json({
				values: { formatted: events.formatted, byId: events.byId },
			})
		} catch (error) {
			handleError(error)
		}
	}

	public createOne: Controller = async (req, res, handleError) => {
		const { start, end, professionalId, serviceId, centerId, seniorId, repeat } = req.body

		try {
			// Se buscan los datos a utilizar con Promise.all
			const [professional, service, senior, center] = await Promise.all([
				prisma.professional.findUnique({ where: { id: professionalId } }),
				prisma.service.findUnique({ where: { id: Number(serviceId) } }),
				seniorId
					? prisma.senior.findUnique({ where: { id: seniorId } })
					: Promise.resolve(null),
				prisma.center.findUnique({ where: { id: Number(centerId) } }),
			])

			// Se verifica que los datos existan
			if (!professional) throw new AppError(400, "Profesional no encontrado")
			if (!service) throw new AppError(400, "Servicio no encontrado")
			if (seniorId && !senior) throw new AppError(400, "Adulto mayor no encontrado")
			if (!center) throw new AppError(400, "Centro no encontrado")
			if (senior && !senior?.validated)
				throw new AppError(409, "La persona mayor no está validada")

			console.log(start)

			const event = {
				start: dayjs(start),
				end: dayjs(end),
				professionalId,
				serviceId: Number(serviceId),
				seniorId: seniorId ?? null,
				centerId: Number(centerId),
			}

			await this.service.createEvents({ ...event, repeat }).catch((error) => {
				throw new AppError(409, error.message)
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
				seniorId
					? prisma.senior.findUnique({ where: { id: seniorId } })
					: Promise.resolve(null),
				centerId
					? prisma.center.findUnique({ where: { id: Number(centerId) } })
					: Promise.resolve(null),
				prisma.event.findUnique({ where: { id: Number(id) } }),
			])

			// Se verifica que los datos existan
			if (!professional) throw new AppError(400, "Profesional no encontrado")
			if (!service) throw new AppError(400, "Servicio no encontrado")
			if (seniorId && !senior) throw new AppError(400, "Adulto mayor no encontrado")
			if (centerId && !center) throw new AppError(400, "Centro no encontrado")

			//Benja
			if (!eventExists) throw new AppError(400, "Evento no encontrado")
			const eventExistsChange = eventExists.assistance !== assistance
			if (eventExistsChange && dayjs().isAfter(dayjs(eventExists.end).add(3, "days"))) {
				throw new AppError(
					400,
					"No se puede autorizar la asistencia despues de 3 dias de la finalización del evento",
				)
			}

			// Convertir las fechas a objetos Date
			const startDate = new Date(start)
			const endDate = new Date(end)

			const orDateSuperposition = {
				start: { lte: endDate },
				end: { gte: startDate },
			}

			// Se buscan eventos donde la id del evento sea diferente a la que se quiere actualizar
			// Y que se superpongan con las fechas del evento a actualizar

			let seniorOR = {} as any

			if (seniorId) {
				seniorOR["seniorId"] = seniorId
				seniorOR = { ...seniorOR, ...orDateSuperposition }
			}

			const events = await prisma.event.findMany({
				where: {
					AND: [
						{
							OR: [{ professionalId, ...orDateSuperposition }, seniorOR],
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
					seniorId: seniorId ?? null,
					centerId: Number(centerId),
					assistance,
				},
			})

			event = this.service.singleFormat(event)

            io.to("ADMIN").emit("event:update", event)
			io.to("FUNCTIONARY").emit("event:update", event)
            
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
				where: { id: Number(params.id) },
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
				where: { id: Number(params.id) },
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
				AND: [
					{ seniorId: senior.id },
					{ serviceId: event.service.id },
					{ updatedAt: { gte: twoMonthsAgo } },
				],
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
				where: { id: Number(params.id) },
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
				where: { id: Number(params.id), seniorId: senior.id },
			})

			if (!event) throw new AppError(404, "Evento no encontrado")

			const updated = await prisma.event.update({
				where: { id: Number(params.id) },
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
}
