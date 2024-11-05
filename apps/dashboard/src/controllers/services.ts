import { prisma } from "@repo/database"
import { Prisma } from "@prisma/client"
import { fileToFormData } from "../utils/files"
import { AppError, httpRequest } from "@repo/lib"
import { Request, Response, NextFunction } from "express"
import { generateSelect, serviceSelect } from "../utils/filters"

// Controlador de tipo select puede recibir un query para seleccionar campos específicos
// Un ejemplo de query sería: /services?select=name,color

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	// Se extraen los campos de la query select
	const selectQuery = req.query.select?.toString()
	// Se mapean los campos de la query select a los campos de la base de datos
	const select = generateSelect<Prisma.ServiceSelect>(selectQuery, serviceSelect)

	try {
		const services = await prisma.service.findMany({ select })
		return res.status(200).json({ values: services })
	} catch (error) {
		next(error)
	}
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, title, description, color } = req.body
		const file = req.file

		if (!file) throw new AppError(400, "No se a enviado un archivo")

		const serviceExists = await prisma.service.findFirst({
			where: { OR: [{ name }, { color }] },
		})

		if (serviceExists) {
			const conflicts = []
			if (serviceExists.name === name) conflicts.push("name")
			if (serviceExists.color === color) conflicts.push("color")
			throw new AppError(400, "Ya existe un servicio con este nombre o color", { conflicts })
		}

		const service = await prisma.service.create({
			data: { name, title, description, color },
		})

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/upload?path=%2Fservices`,
			method: "POST",
			variant: "MULTIPART",
			body: fileToFormData(file, service.id.toString()),
		})

		if (response.type == "error") {
			await prisma.service.delete({ where: { id: service.id } })
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(201).json({ values: { modified: service } })
	} catch (error) {
		next(error)
	}
}

export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params
		const { name, title, description, color } = req.body

		const serviceExists = await prisma.service.findFirst({
			where: { OR: [{ name }, { color }], AND: { NOT: { id: Number(id) } } },
		})

		if (serviceExists) {
			const conflicts = []
			if (serviceExists.name === name) conflicts.push("name")
			if (serviceExists.color === color) conflicts.push("color")
			throw new AppError(409, "Ya existe un servicio con este nombre o color", { conflicts })
		}

		const service = await prisma.service.update({
			where: { id: Number(id) },
			data: { name, title, description, color },
			select: { id: true, name: true, title: true, description: true, color: true },
		})

		if (req.file) {
			const response = await httpRequest<null>({
				service: "STORAGE",
				endpoint: `/upload?path=%2Fservices`,
				method: "POST",
				variant: "MULTIPART",
				body: fileToFormData(req.file, service.id.toString()),
			})

			if (response.type == "error") {
				throw new AppError(response.status ?? 500, response.message)
			}
		}

		return res.status(200).json({ values: { modified: service } })
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id)

		const service = await prisma.service.findUnique({
			where: { id },
		})

		if (!service) throw new AppError(400, "El centro no existe")

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

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/delete?path=%2Fservices%2F${service.id}.webp`,
			method: "DELETE",
			variant: "JSON",
			body: {},
		})

		if (response.type == "error") {
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(200).json({ values: { modified: deleted } })
	} catch (error) {
		next(error)
	}
}
