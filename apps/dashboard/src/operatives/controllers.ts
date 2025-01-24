import { prisma } from "@repo/database"
import { OperativesSchemas } from "./schemas"
import { AppError, Conflict, Controller, StorageService } from "@repo/lib"

export class OperativesController {
	constructor(
		private storage: StorageService,
		private schemas: OperativesSchemas,
	) {}

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const operativos = await prisma.operatives.findMany({
				select: this.schemas.defaultSelect,
			})

			return res.status(200).json({ values: operativos })
		} catch (error) {
			handleError(error)
		}
	}

	public createOne: Controller = async (req, res, handleError) => {
		const { body, file } = req
		const { name, description, start, end, centerId, services, professionals } = body
		console.log(file)
		try {
			const exists = await prisma.operatives.findFirst({
				where: { name },
			})

			if (exists) {
				throw new AppError(409, "El operativo ya existe")
			}

			const operative = await prisma.operatives.create({
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
			// Actualizar el operativo
			const operative = await prisma.operatives.update({
				where: { id: Number(id) },
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
				select: this.schemas.defaultSelect,
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
			const operativo = await prisma.operatives.delete({
				where: { id: Number(id) },
				select: this.schemas.defaultSelect,
			})

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
