import { prisma } from "@repo/database"
import { OperativesSchemas } from "./schemas"
import { AppError, Controller, StorageService, MailerService, templates } from "@repo/lib"
import { EventService } from "../events/service"
import dayjs from "dayjs"

export class OperativesController {
	constructor(
		private storage: StorageService,
		private schemas: OperativesSchemas,
		private eventService: EventService = new EventService(),
		private mailer: MailerService,
	) { }

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
			const professionalId = query.professionalId

			const operativos = await prisma.operative.findMany({
				select: this.schemas.defaultSelect,
				where: {
					professionals: professionalId ? {
						some: {
							id: professionalId
						}
					} : undefined
				}
			})

			const operatives = this.eventService.format([], operativos)

			return res.status(200).json({
				values: { formatted: operatives.formatted, byId: operatives.byId },
			})
		} catch (error) {
			handleError(error)
		}
	}

	public createOne: Controller = async (req, res, handleError) => {
		const { body, file } = req
		const { name, description, start, end, centerId, services, professionals } = body

		try {
			const exists = await prisma.operative.findFirst({
				where: { name },
			})

			if (exists) {
				throw new AppError(409, "El operativo ya existe")
			}

			const startDate = dayjs(start).startOf("day").toDate()
			const endDate = dayjs(start).endOf("day").toDate()

			await prisma.event.deleteMany({
				where: {
					start: { gte: startDate, lte: endDate },
					professionalId: { in: professionals },
				},
			})

			const operative = await prisma.operative.create({
				data: {
					name,
					description,
					start,
					end,
					centerId: Number(centerId),
					services: { connect: services.map((id: number) => ({ id: Number(id) })) },
					professionals: { connect: professionals.map((id: string) => ({ id })) },
				},
				select: this.schemas.defaultSelect,
			})

			await this.storage.uploadFile({
				input: file as Express.Multer.File,
				url: `/upload?path=%2Foperatives`,
				filename: operative.id.toString(),
			})

			for (const { email, name } of operative.professionals) {
				const operativeData = {
					name: operative.name,
					description: operative.description,
					email,
					professionalName: name,
					start: operative.start,
					end: operative.end,
					services: operative.services,
					center: operative.center,
				}

				this.mailer.send({
					to: email,
					subject: "Nuevo operativo asignado",
					html: templates.operativeAssignation(operativeData),
				})
			}

			return res.status(201).json({ values: { modified: operative } })
		} catch (error) {
			handleError(error)
		}
	}

	public updateOne: Controller = async (req, res, handleError) => {
		const { id } = req.params
		const { file, body } = req
		const { name, description, start, end, centerId, services, professionals } = body

		try {
			const operative = await prisma.operative.update({
				where: { id: id },
				select: this.schemas.defaultSelect,
				data: {
					name,
					description,
					start,
					end,
					centerId: Number(centerId),
					services: services
						? { set: services.map((serviceId: number) => ({ id: Number(serviceId) })) }
						: undefined,
					professionals: professionals
						? {
							set: professionals.map((professionalId: string) => ({
								id: professionalId,
							})),
						}
						: undefined,
				},
			})

			if (file) {
				await this.storage.uploadFile({
					input: file as Express.Multer.File,
					url: `/upload?path=%2Foperatives`,
					filename: operative.id.toString(),
				})
			}

			return res.status(200).json({ values: { modified: operative } })
		} catch (error) {
			handleError(error)
		}
	}

	public deleteOne: Controller = async (req, res, handleError) => {
		const { id } = req.params

		try {
			const operativo = await prisma.operative.delete({
				where: { id: id },
				select: this.schemas.defaultSelect,
			})

			for (const { email } of operativo.professionals) {
				const operativeDataDelete = {
					email,
					name: operativo.name,
					start: operativo.start,
					end: operativo.end,
				}
				this.mailer.send({
					to: email,
					subject: "Este operativo se a eliminado",
					html: templates.operativeAssignationDelete(operativeDataDelete),
				})
			}

			return res.status(200).json({ values: { modified: operativo } })
		} catch (error) {
			handleError(error)
		}
	}

	public confirmAction: Controller = async (req, res, handleError) => {
		const { action } = req.body

		try {
			if (!action) throw new AppError(400, "Por favor, ingrese la acción a confirmar")

			// Aquí puedes agregar lógica adicional para confirmar acciones

			return res.status(200).json({ message: "Acción confirmada" })
		} catch (error) {
			handleError(error)
		}
	}
}
