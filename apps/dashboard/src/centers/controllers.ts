import { prisma } from "@repo/database"
import { DailySessions } from "@prisma/client"
import { CentersSchemas } from "./schemas"
import { StorageService } from "@repo/lib"
import { Conflict, BadRequest, Controller } from "@repo/lib"

export class CentersController {
	constructor(
		private schemas: CentersSchemas,
		private storage: StorageService,
	) {}

	/**
	 * Obtener todos los centros de atención registrados, puede aceptar una query
	 * Para seleccionar los campos a devolver
	 *
	 * path: /api/dashboard/centers - GET
	 *
	 * @returns Promise<Response>
	 */

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const query = this.schemas.query.parse(req.query)
			const centers = await prisma.center.findMany({
				select: query.select ?? this.schemas.defaultSelect,
			})

			return res.status(200).json({ values: centers })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Crear un centro de atención
	 * Se debe enviar un archivo en el body con el nombre de "file"
	 *
	 * path: /api/dashboard/centers - POST
	 *
	 * @returns Promise<Response>
	 * @throws BadRequest
	 * @throws Conflict
	 */

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

	/**
	 * Actualizar un centro de atención
	 * Se puede enviar un archivo en el body con el nombre de "file"
	 * Se debe enviar el id del centro en los parámetros
	 *
	 * path: /api/dashboard/centers/:id - PATCH
	 *
	 * @returns Promise<Response>
	 * @throws AppError HTTP 400 | HTTP 409
	 */

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
				select: this.schemas.defaultSelect,
				where: { id: Number(id) },
				data: { name, address, phone, color },
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

	/**
	 * Eliminar un centro de atención
	 * Se debe enviar el id del centro en los parámetros
	 * Se eliminarán todos los eventos asociados a este centro
	 * Se eliminará archivo asociado a este centro
	 *
	 * path: /api/dashboard/centers/:id - DELETE
	 *
	 * @returns Promise<Response>
	 * @throws AppError HTTP 400
	 */

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

	/**
	 * Actualiza las atenciones diarias de los servicios en un centro (centerId)
	 *
	 * path: /dashboard/centers/daily-sessions/:centerId - HTTP PATCH
	 *
	 * @returns Promise<Response>
	 * @throws AppError
	 */

	public updateDailySessions: Controller = async (req, res, handleError) => {
		const { body, params } = req

		try {
			const sessions = await prisma.dailySessions.findMany({
				where: { centerId: Number(params.id) },
			})

			const changes: DailySessions[] = []

			for (let i = 0; i < sessions.length; i++) {
				const session = sessions[i]

				if (body[session.id] !== session.quantity) {
					changes.push({ ...session, quantity: Number(body[session.id]) })
				}
			}

			await prisma.$transaction(
				changes.map((change) =>
					prisma.dailySessions.update({
						where: { id: change.id },
						data: { quantity: change.quantity },
					}),
				),
			)

			return res.status(200).json({ values: { modified: "" } })
		} catch (error) {
			handleError(error)
		}
	}
}
