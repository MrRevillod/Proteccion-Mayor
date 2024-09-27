import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"
import { bufferToBlob } from "../utils/files"
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const service = await prisma.service.findMany({
			select: {
				id: true,
				name: true,
				title: true,
			},
		})

		return res.status(200).json({
			message: "Servicios obtenidos correctamente",
			type: "success",
			values: {
				service,
				len: service.length,
			},
		})
	} catch (error) {
		next(error)
	}
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, title } = req.body
		const file = req.file as Express.Multer.File

		const serviceExists = await prisma.service.findFirst({
			where: { name },
		})

		if (serviceExists) {
			return res.status(409).json({
				message: "El servicio con ese nombre ya existe",
				type: "error",
				values: ["name"],
			})
		}

		const formData = new FormData()
		const image = bufferToBlob(file.buffer, file.mimetype)
		formData.append("image", image, file.originalname)
		console.log(formData)

		/* 	const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/services/${req.body.id}`,
			method: "POST",
			variant: "MULTIPART",
			body: formData,
		})

		if (response.type == "error") {
			throw new AppError(response.status ?? 500, response.message)
		} */

		const service = await prisma.service.create({
			data: {
				name,
				title,
			},
		})

		return res.status(201).json({
			message: "Servicio creado correctamente",
			type: "success",
			values: service,
		})
	} catch (error) {
		next(error)
	}
}

export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params
		const { name, title } = req.body
		const updatedService = await prisma.service.update({
			where: { id: Number(id) },
			data: {
				name,
				title,
			},
			select: {
				id: true,
				name: true,
				title: true,
			},
		})

		return res.status(200).json({
			message: "Servicio actualizado exitosamente",
			type: "success",
			values: { updatedService },
		})
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Number(req.params.id)

		await prisma.professional.updateMany({
			where: { serviceId: id },
			data: { serviceId: null },
		})
		await prisma.service.delete({ where: { id } })

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: null,
		})
	} catch (error) {
		next(error)
	}
}