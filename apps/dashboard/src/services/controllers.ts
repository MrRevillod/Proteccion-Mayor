import { prisma } from "@repo/database"
import { StorageService } from "@repo/lib"
import { ServicesSchemas } from "./schemas"
import { AppError, Controller } from "@repo/lib"

export class ServicesController {
	constructor(
		private storage: StorageService,
		private schemas: ServicesSchemas,
	) {}

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const query = this.schemas.query.parse(req.query)
			const services = await prisma.service.findMany({
				select: query.select,
			})

			return res.status(200).json({ values: services })
		} catch (error) {
			handleError(error)
		}
	}

	public createOne: Controller = async (req, res, handleError) => {
		const { body, file } = req
		const { name, title, description, color } = body

		try {
			const exists = await prisma.service.findFirst({
				where: { OR: [{ name }, { color }] },
			})

			if (exists) {
				const conflicts = []
				if (exists.name === name) conflicts.push("name")
				if (exists.color === color) conflicts.push("color")
				throw new AppError(409, "Ya existe un servicio con este nombre o color", {
					conflicts,
				})
			}

			const service = await prisma.service.create({
				data: { name, title, description, color },
			})

			await this.storage.uploadFile({
				input: file as Express.Multer.File,
				url: `/upload?path=%2Fservices`,
				filename: service.id.toString(),
			})

			return res.status(201).json({ values: { modified: service } })
		} catch (error) {
			handleError(error)
		}
	}

	public updateOne: Controller = async (req, res, handleError) => {
		const { params, body, file } = req
		const { name, title, description, color } = body

		try {
			const exists = await prisma.service.findFirst({
				where: {
					OR: [{ name }, { color }],
					AND: { NOT: { id: Number(params.id) } },
				},
			})

			if (exists) {
				const conflicts = []
				if (exists.name === name) conflicts.push("name")
				if (exists.color === color) conflicts.push("color")
				throw new AppError(409, "Ya existe un servicio con este nombre o color", {
					conflicts,
				})
			}

			const service = await prisma.service.update({
				where: { id: Number(params.id) },
				data: { name, title, description, color },
				select: this.schemas.defaultSelect,
			})

			if (file) {
				await this.storage.uploadFile({
					input: file as Express.Multer.File,
					url: `/upload?path=%2Fservices`,
					filename: service.id.toString(),
				})
			}

			return res.status(200).json({ values: { modified: service } })
		} catch (error) {
			handleError(error)
		}
	}

	public deleteOne: Controller = async (req, res, handleError) => {
		const { params } = req

		try {
			const id = Number(params.id)

			await prisma.$transaction([
				prisma.professional.updateMany({
					where: { serviceId: id },
					data: { serviceId: null },
				}),
				prisma.event.deleteMany({
					where: { serviceId: id },
				}),
			])

			const deleted = await prisma.service.delete({ where: { id } })

			await this.storage.deleteFile({
				url: `/delete?path=%2Fservices%2F${id}.webp`,
			})

			return res.status(200).json({ values: { modified: deleted } })
		} catch (error) {
			handleError(error)
		}
	}
}
