import { prisma } from "@repo/database"
import { CentersSchemas } from "./schemas"
import { StorageService } from "@repo/lib"
import { Conflict, BadRequest, Controller } from "@repo/lib"

export class CentersController {
	constructor(
		private schemas: CentersSchemas,
		private storage: StorageService,
	) {}

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const query = this.schemas.query.parse(req.query)
			const centers = await prisma.center.findMany({
				select: query.select ?? undefined,
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
				select: this.schemas.defaultSelect,
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
