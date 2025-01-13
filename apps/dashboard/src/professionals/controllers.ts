import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { Professional } from "@prisma/client"
import { ProfessionalsSchemas } from "./schemas"
import { AppError, Controller, templates } from "@repo/lib"
import { credentials, MailerService, StorageService } from "@repo/lib"

export class ProfessionalsController {
	constructor(
		private schemas: ProfessionalsSchemas,
		private storage: StorageService,
		private mailer: MailerService,
	) {}

	/**
	 * Obtener todos los profesionales registrados, puede aceptar una query
	 * Query: ?id=""&serviceId=""&select=""
	 *
	 * path: /api/dashboard/professionals - GET
	 *
	 * @returns (Express Response) (HTTP - 200)
	 * @throws (AppError) (HTTP - 400)
	 */

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const query = this.schemas.query.parse(req.query)
			const select = query.select ?? this.schemas.defaultSelect

			const professionals = await prisma.professional.findMany({
				select,
				where: {
					id: query.id ? { equals: query.id } : undefined,
					serviceId: query.serviceId ? { equals: query.serviceId } : undefined,
				},
			})

			return res.status(200).json({ values: professionals })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Registrar un profesional en el sistema, debe incluir una imagen en el body
	 *
	 * Content-Type: multipart/form-data
	 * path: /api/dashboard/professionals - POST
	 *
	 * @returns (Express Response) (HTTP - 201)
	 * @throws (AppError) (HTTP - 409)
	 */

	public createOne: Controller = async (req, res, handleError) => {
		const { id, name, email, serviceId } = req.body

		try {
			const [proExists, servExists] = await Promise.all([
				prisma.professional.findFirst({ where: { OR: [{ id }, { email }] } }),
				prisma.service.findFirst({ where: { id: serviceId } }),
			])

			if (proExists) {
				const conflicts = []
				if (proExists.id === id) conflicts.push("id")
				if (proExists.email === email) conflicts.push("email")
				throw new AppError(409, "El profesional ya existe", { conflicts })
			}

			if (!servExists) {
				throw new AppError(409, "El servicio no existe", { conflicts: ["serviceId"] })
			}

			const [password, hash] = await credentials.generatePassword()

			const professional = await prisma.professional.create({
				select: this.schemas.defaultSelect,
				data: { id, name, email, password: hash, serviceId },
			})

			this.mailer.send({
				to: email,
				subject: "Bienvenido a Protección Mayor",
				html: templates.welcome(name, email, password),
			})

			return res.status(201).json({ values: { modified: professional } })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Actualizar un profesional en el sistema, puede incluir una imagen en el body
	 *
	 * Content-Type: multipart/form-data
	 * path: /api/dashboard/professionals/:id - PATCH
	 *
	 * @returns (Express Response) (HTTP - 200)
	 * @throws (AppError) (HTTP - 400 | 409)
	 */

	public updateOne: Controller = async (req, res, handleError) => {
		const { params, body, file } = req
		const { name, email, password } = body

		const user = req.getExtension("reqResource") as Professional

		try {
			const exists = await prisma.professional.findFirst({
				where: { email, id: { not: params.id } },
			})

			if (exists) {
				throw new AppError(409, "El profesional ya existe", { conflicts: ["email"] })
			}

			const updatedPassword = password ? await hash(password, 10) : user.password

			const professional = await prisma.professional.update({
				where: { id: params.id },
				select: this.schemas.defaultSelect,
				data: { name, email, password: updatedPassword },
			})

			const response = { modified: professional, image: null }

			if (file) {
				const storage = await this.storage.uploadFile({
					input: file,
					filename: params.id,
					url: `/upload?path=%2Fusers%2F${params.id}`,
				})

				response.image = storage.image as any
			}

			return res.status(200).json({ values: response })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Eliminar un profesional en el sistema
	 *
	 * path: /api/dashboard/professionals/:id - DELETE
	 *
	 * @returns (Express Response) (HTTP - 200)
	 * @throws (AppError)
	 */

	public deleteOne: Controller = async (req, res, handleError) => {
		const { params } = req

		try {
			await prisma.event.updateMany({
				where: { professionalId: params.id },
				data: { professionalId: null },
			})

			const deleted = await prisma.professional.delete({
				where: { id: params.id },
			})

			await this.storage.deleteFile({
				url: `/delete?path=%2Fusers%2F${params.id}`,
			})

			return res.status(200).json({ values: { modified: deleted } })
		} catch (error) {
			handleError(error)
		}
	}
}
