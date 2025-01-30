import { prisma } from "@repo/database"
import { SectorSchemas } from "./schemas"
import { Conflict, Controller } from "@repo/lib"

export class SectorsController {
	constructor(private schemas: SectorSchemas) {}

	/**
	 * Obtener todos los sectores registrados, puede aceptar una query
	 *
	 * path: /api/dashboard/sectors/ - GET
	 *
	 * @returns HTTP 200 OK
	 * @throws HTTP 500 Internal Server Error
	 */

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const query = this.schemas.query.parse(req.query)
			const select = query.select ?? this.schemas.defaultSelect
			const sectors = await prisma.sector.findMany({ select })

			return res.status(200).json({ values: sectors })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Crear un nuevo sector en el sistema
	 *
	 * path: /api/dashboard/sectors/ - POST
	 *
	 * @returns HTTP 201 Created
	 * @throws HTTP 409 Conflict | HTTP 400 Bad Request
	 */

	public createOne: Controller = async (req, res, handleError) => {
		const { name } = req.body

		try {
			const exists = await prisma.sector.findFirst({ where: { name } })
			if (exists) throw new Conflict("Ya existe un sector con ese nombre")

			const sector = await prisma.sector.create({ data: { name } })
			return res.status(201).json({ values: { modified: sector } })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Actualizar un sector en el sistema
	 *
	 * path: /api/dashboard/sectors/:id - PATCH
	 *
	 * @returns HTTP 200 OK
	 * @throws HTTP 409 Conflict | HTTP 400 Bad Request
	 */

	public updateOne: Controller = async (req, res, handleError) => {
		const { params, body } = req

		try {
			const exists = await prisma.sector.findFirst({
				where: { name: body.name, id: { not: Number(params.id) } },
			})

			if (!exists) throw new Conflict("Ya existe un sector con ese nombre")

			const sector = await prisma.sector.update({
				where: { id: Number(params.id) },
				data: { name: body.name },
			})

			return res.status(200).json({ values: { modified: sector } })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Eliminar un sector en el sistema
	 *
	 * path: /api/dashboard/sectors/:id - DELETE
	 *
	 * @returns HTTP 200 OK
	 * @throws HTTP 400 Bad Request
	 */

	public deleteOne: Controller = async (req, res, handleError) => {
		const { params } = req

		try {
			await prisma.sector.delete({ where: { id: Number(params.id) } })
			return res.status(200).json({ values: { modified: null } })
		} catch (error) {
			handleError(error)
		}
	}
}
