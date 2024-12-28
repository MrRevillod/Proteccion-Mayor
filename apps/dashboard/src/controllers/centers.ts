import { prisma } from "@repo/database"
import { Prisma } from "@prisma/client"
import { StorageService } from "../services/storage"
import { centerSelect, generateSelect } from "../utils/filters"
import { Conflict, BadRequest, Controller } from "@repo/lib"

export class CenterController {
	private storage: StorageService

	constructor() {
		this.storage = new StorageService()
	}

	public getMany: Controller = async (req, res, handleError) => {
		const selectQuery = req.query.select?.toString()
		const select = generateSelect<Prisma.CenterSelect>(selectQuery, centerSelect)

		let filter = {} as Prisma.CenterWhereInput

		if (req.query.professionalId) {
			filter = {
				Event: {
					some: {
						professionalId: req.query.professionalId.toString(),
					},
				},
			}
		}

		try {
			const centers = await prisma.center.findMany({
				where: filter ? { ...filter } : undefined,
				select,
				distinct: ["id"],
			})

			return res.status(200).json({ values: centers })
		} catch (error) {
			handleError(error)
		}
	}

	public createOne: Controller = async (req, res, handleError) => {
		const { body, file } = req
		const { name, address, phone, color } = body

		if (!file) throw new BadRequest("No se ha subido un archivo")

		try {
			const exists = await prisma.center.findFirst({
				where: { name: body.name },
			})

			if (exists) {
				throw new Conflict("Ya existe un centro con este nombre", { conflicts: ["name"] })
			}

			const center = await prisma.center.create({
				data: { name, address, phone, color },
			})

			await this.storage.uploadFile({
				input: file,
				url: `/upload?path=%2Fcenters`,
				filename: center.id.toString(),
			})

			return res.status(201).json({ values: { modified: center } })
		} catch (error) {
			handleError(error)
		}
	}

	public updateOne: Controller = async (req, res, handleError) => {
		const { body, file, params } = req

		const { id } = params
		const { name, address, phone, color } = body

		try {
			const exists = await prisma.center.findFirst({
				where: { name: body.name, id: { not: Number(id) } },
			})

			if (exists) {
				throw new Conflict("Ya existe un centro con este nombre", { conflicts: ["name"] })
			}

			const center = await prisma.center.update({
				where: { id: Number(id) },
				data: { name, address, phone, color },
				select: centerSelect,
			})

			if (file) {
				await this.storage.uploadFile({
					input: file,
					url: `/upload?path=%2Fcenters`,
					filename: center.id.toString(),
				})
			}

			return res.status(200).json({ values: { modified: center } })
		} catch (error) {
			handleError(error)
		}
	}

	public deleteOne: Controller = async (req, res, handleError) => {
		const { params } = req

		try {
			const center = await prisma.center.findUnique({
				where: { id: Number(params.id) },
			})

			if (!center) throw new BadRequest("El centro no existe")

			await prisma.event.updateMany({
				where: { centerId: center.id },
				data: { centerId: null },
			})

			const deleted = await prisma.center.delete({ where: { id: center.id } })
			await this.storage.deleteFile({
				url: `/delete?path=%2Fcenters%2F${center.id}.webp`,
			})

			return res.status(200).json({ values: { modified: deleted } })
		} catch (error) {
			handleError(error)
		}
	}
}

// import { prisma } from "@repo/database"
// import { Prisma } from "@prisma/client"
// import { fileToFormData } from "../utils/files"
// import { AppError, httpRequest } from "@repo/lib"
// import { centerSelect, generateSelect } from "../utils/filters"
// import { Request, Response, NextFunction } from "express"

// // Controlador de tipo select puede recibir un query para seleccionar campos específicos
// // Un ejemplo de query sería: /centers?select=name,email
// export const getAll = async (req: Request, res: Response, next: NextFunction) => {
// 	const selectQuery = req.query.select?.toString()
// 	const select = generateSelect<Prisma.CenterSelect>(selectQuery, centerSelect)

// 	let filter = {} as Prisma.CenterWhereInput

// 	if (req.query.professionalId) {
// 		filter = {
// 			Event: {
// 				some: {
// 					professionalId: req.query.professionalId.toString(),
// 				},
// 			},
// 		}
// 	}

// 	try {
// 		const centers = await prisma.center.findMany({
// 			where: filter ? { ...filter } : undefined,
// 			select,
// 			distinct: ["id"],
// 		})

// 		return res.status(200).json({ values: centers })
// 	} catch (error) {
// 		next(error)
// 	}
// }

// export const create = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { name, address, phone, color } = req.body
// 		const file = req.file as Express.Multer.File

// 		if (!file) throw new AppError(400, "No se ha enviado un archivo")

// 		const centerExists = await prisma.center.findFirst({ where: { name } })

// 		if (centerExists) {
// 			throw new AppError(409, "Ya existe un centro de atención con este nombre", {
// 				conflicts: ["name"],
// 			})
// 		}

// 		const center = await prisma.center.create({
// 			data: { name, address, phone, color },
// 		})

// 		const response = await httpRequest<null>({
// 			service: "STORAGE",
// 			endpoint: `/upload?path=%2Fcenters`,
// 			method: "POST",
// 			variant: "MULTIPART",
// 			body: fileToFormData(file, center.id.toString()),
// 		})

// 		if (response.type == "error") {
// 			await prisma.center.delete({ where: { id: center.id } })
// 			throw new AppError(response.status ?? 500, response.message)
// 		}

// 		return res.status(201).json({ values: { modified: center } })
// 	} catch (error) {
// 		next(error)
// 	}
// }

// export const updateById = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { id } = req.params
// 		const { name, address, phone, color } = req.body

// 		const center = await prisma.center.update({
// 			where: { id: Number(id) },
// 			data: { name, address, phone, color },
// 			select: { id: true, name: true, address: true, phone: true },
// 		})

// 		if (req.file) {
// 			const response = await httpRequest<null>({
// 				service: "STORAGE",
// 				endpoint: `/upload?path=%2Fcenters`,
// 				method: "POST",
// 				variant: "MULTIPART",
// 				body: fileToFormData(req.file, center.id.toString()),
// 			})

// 			if (response.type == "error") {
// 				await prisma.center.delete({ where: { id: center.id } })
// 				throw new AppError(response.status ?? 500, response.message)
// 			}
// 		}

// 		return res.status(200).json({ values: { modified: center } })
// 	} catch (error) {
// 		next(error)
// 	}
// }

// export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const id = Number(req.params.id)

// 		const center = await prisma.center.findUnique({
// 			where: { id },
// 		})

// 		if (!center) throw new AppError(400, "El centro no existe")

// 		await prisma.event.updateMany({
// 			where: { centerId: id },
// 			data: { centerId: null },
// 		})

// 		const deleted = await prisma.center.delete({ where: { id } })

// 		const response = await httpRequest<null>({
// 			service: "STORAGE",
// 			endpoint: `/delete?path=%2Fcenters%2F${center.id}.webp`,
// 			method: "DELETE",
// 			variant: "JSON",
// 			body: {},
// 		})

// 		if (response.type == "error") {
// 			throw new AppError(response.status ?? 500, response.message)
// 		}

// 		return res.status(200).json({ values: { modified: deleted } })
// 	} catch (error) {
// 		next(error)
// 	}
// }
