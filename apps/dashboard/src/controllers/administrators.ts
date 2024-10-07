import { hash } from "bcrypt"
import { Prisma } from "@prisma/client"
import { prisma } from "@repo/database"
import { AppError, constants } from "@repo/lib"
import { deleteProfilePicture, uploadProfilePicture } from "../utils/files"
import { Request, Response, NextFunction } from "express"

// Controlador para obtener todos los administradores de la base de datos
// se excluye el campo password de la respuesta
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const administrators = await prisma.administrator.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				password: false,
				createdAt: true,
				updatedAt: true,
			},
		})

		return res.status(200).json({
			type: "success",
			values: { administrators, len: administrators.length },
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para crear un nuevo administrador
export const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email } = req.body
		const defaulAdminPassword = await hash(constants.DEFAULT_ADMIN_PASSWORD, 10)

		// Verificamos si el administrador ya existe

		const filter: Prisma.AdministratorWhereInput = {
			OR: [{ id }, { email }],
		}

		const userExists = await prisma.administrator.findFirst({ where: filter })

		if (userExists) {
			const conflicts = []

			// Si el admin ya existe se verificará que campo está en conflicto

			if (userExists?.id === id) conflicts.push("id")
			if (userExists?.email === email) conflicts.push("email")

			// Y se retornará un arreglo con los campos en conflicto
			throw new AppError(409, "El administrador ya existe", { conflicts })
		}

		// Se crea el administrador y se retorna la respuesta
		// excluyendo el campo password ya que no es un dato de dominio público

		const { password, ...administrator } = await prisma.administrator.create({
			data: { id, name, email, password: defaulAdminPassword },
		})

		return res.status(201).json({
			message: "Creación exitosa",
			type: "success",
			values: administrator,
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para Actualizar un administrador por su id
export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id

	try {
		const adminExist = await prisma.administrator.findUnique({ where: { id } })

		if (!adminExist) {
			throw new AppError(400, "El administrador solicitado no existe")
		}

		const { name, email, password } = req.body
		const updatedPassword = password ? await hash(password, 10) : adminExist.password

		const administrator = await prisma.administrator.update({
			where: { id: id },
			data: { name, email, password: updatedPassword },
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		const response = { updated: administrator, image: null }

		if (req.file) {
			const storageResponse = await uploadProfilePicture({
				file: req.file,
				filename: req.params.id,
				endpoint: `/upload?path=%2Fusers%2F${req.params.id}`,
			})

			if (storageResponse.type === "error") {
				throw new AppError(storageResponse.status || 500, storageResponse.message)
			}

			response.image = storageResponse.values.image
		}

		return res.status(200).json({
			message: "Actualización exitosa",
			type: "success",
			values: response,
		})
	} catch (error) {
		next(error)
	}
}

// Controlador para eliminar un administrador por su id
export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id

	try {
		const adminExist = await prisma.administrator.findUnique({ where: { id } })

		if (!adminExist) {
			throw new AppError(400, "El administrador solicitado no existe")
		}

		await prisma.administrator.delete({ where: { id } })

		const storageResponse = await deleteProfilePicture(`/delete?path=%2Fusers%2F${id}`)

		if (storageResponse.type === "error") {
			throw new AppError(storageResponse.status || 500, storageResponse.message)
		}

		return res.status(200).json({
			message: "Eliminación exitosa",
			type: "success",
			values: { deletedId: id },
		})
	} catch (error) {
		next(error)
	}
}
