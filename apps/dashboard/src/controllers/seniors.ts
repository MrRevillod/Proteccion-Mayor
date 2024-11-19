import { hash } from "bcrypt"
import { prisma } from "@repo/database"
import { Gender, Prisma, Senior } from "@prisma/client"
import { Request, Response, NextFunction } from "express"
import { AppError, constants, httpRequest } from "@repo/lib"
import { generateSelect, generateWhere, seniorSelect } from "../utils/filters"
import { deleteProfilePicture, filesToFormData, uploadProfilePicture } from "../utils/files"
import { sendMail } from "../utils/mailer"
import { seniorWelcomeEmailBody } from "../utils/emailTemplates"

/// Controlador para manejar el registro de adultos mayores desde la aplicación móvil
export const registerFromMobile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Verificar si el adulto mayor ya existe en la base de datos
		const { rut, pin, email } = req.body

		if (await prisma.senior.findUnique({ where: { id: rut } })) {
			throw new AppError(409, "La persona que estas tratando de registrar ya existe")
		}

		// Si el adulto mayor no existe, se crea un registro en la base de datos

		await prisma.senior.create({
			data: {
				id: rut,
				name: "",
				email: email,
				password: await hash(pin, 10),
				address: "",
				birthDate: new Date(),
			},
		})

		// Se envían los archivos a la API de almacenamiento (storage)

		if (!req.files || Object.keys(req.files).length === 0) {
			throw new AppError(400, "No se han enviado archivos")
		}

		const formData = filesToFormData(req.files as { [fieldname: string]: Express.Multer.File[] })

		// Para ello se deben convertir los buffers de la librería MULTER a blobs
		// compatibles con la API de FETCH

		const response = await httpRequest<null>({
			service: "STORAGE",
			endpoint: `/upload?path=%2Fseniors%2F${rut}`,
			method: "POST",
			variant: "MULTIPART",
			body: formData,
		})

		if (response.type == "error") {
			await prisma.senior.delete({ where: { id: rut } })
			throw new AppError(response.status ?? 500, response.message)
		}

		return res.status(201).json({ message: "La persona mayor se ha registrado correctamente" })
	} catch (error: unknown) {
		next(error)
	}
}

// Controlador para manejar las solicitudes de registro de adultos mayores
// Se puede aceptar o rechazar una solicitud de registro
// Esto de pende de la query validate=true | false

export const handleSeniorRequest = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	const validated = req.query.validate === "true"

	try {
		const { name, address, birthDate, gender } = req.body

		// Se verifica si el adulto mayor existe
		const senior = await prisma.senior.findUnique({ where: { id } })

		if (!senior) {
			throw new AppError(400, "Adulto mayor no encontrado")
		}

		if (validated && gender !== "MA" && gender !== "FE") {
			throw new AppError(400, "El género debe ser MA o FE")
		}

		// Si la solicitud es rechazada, se eliminan los archivos enviados
		// y se elimina el adulto mayor de la base de datos

		if (senior.validated) {
			throw new AppError(409, "Esta solicitud ya ha sido validada")
		}

		if (!validated) {
			const storageResponse = await httpRequest({
				service: "STORAGE",
				endpoint: `/delete?path=%2Fseniors%2F${id}`,
				method: "DELETE",
			})

			if (storageResponse.type === "error") {
				throw new AppError(storageResponse.status || 500, storageResponse.message)
			}

			await prisma.senior.delete({ where: { id } })
			return res.status(200).json({ message: "La solicitud ha sido denegada", values: {} })
		}

		// Si la solicitud es aceptada, se actualiza el campo validated a true
		// Esto significa que el adulto mayor ya puede acceder a la aplicaciÃ³n

		await prisma.senior.update({
			where: { id },
			data: {
				name,
				address,
				birthDate,
				validated,
				gender: Gender[gender as keyof typeof Gender],
			},
		})

		await sendMail(senior?.email || "", "Solicitud de registro aceptada", seniorWelcomeEmailBody(senior.name))

		return res.status(200).json({ message: "La solicitud ha sido aceptada", values: {} })
	} catch (error: unknown) {
		next(error)
	}
}

// Controladores CRUD para los adultos mayores

// Controlador de tipo select puede recibir un query para seleccionar campos específicos
// Un ejemplo de query sería: /seniors?select=name,email&validated=true
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const queryToWhereMap = {
		id: (value: any) => ({ contains: value }),
		name: (value: any) => ({ contains: value }),
		gender: (value: Gender) => ({ equals: value }),
	}

	// Separar 'validated' del resto de los parámetros
	const { validated, ...otherQueryParams } = req.query

	// Generar las condiciones OR para 'id' y 'name'
	const orConditions = generateWhere<Prisma.SeniorWhereInput>(otherQueryParams, queryToWhereMap, "OR")

	// Construir el objeto 'where' combinando 'AND' y 'OR'
	const where: Prisma.SeniorWhereInput = {}

	if (validated !== undefined) {
		where.validated = { equals: Number(validated) === 1 }
	}

	if (orConditions.OR && orConditions.OR.length > 0) {
		where.OR = orConditions.OR
	}

	const selectQuery = req.query.select?.toString()
	const select = generateSelect<Prisma.SeniorSelect>(selectQuery, seniorSelect)

	const take = req.query.limit ? Number(req.query.limit) : undefined

	try {
		const seniors = await prisma.senior.findMany({ where, select, take })
		return res.status(200).json({ values: seniors })
	} catch (error) {
		next(error)
	}
}

// Añadir una persona mayor desde la aplicación web por parte de un administrador

export const create = async (req: Request, res: Response, next: NextFunction) => {
	const { DEFAULT_SENIOR_PASSWORD } = constants

	try {
		const { id, email, gender } = req.body
		const defaulAdminPassword = await hash(DEFAULT_SENIOR_PASSWORD, 10)

		const filter: Prisma.SeniorWhereInput = {
			OR: [{ id }, { email }],
		}

		if (gender !== "MA" && gender !== "FE") {
			throw new AppError(400, "El género debe ser MA o FE")
		}

		// Verificar si la persona mayor ya existe en la base de datos

		const userExists = await prisma.senior.findFirst({ where: filter })

		if (userExists) {
			const conflicts = new Array<string>()
			if (userExists?.id === id) conflicts.push("id")
			if (userExists?.email === email) conflicts.push("email")
			throw new AppError(409, "La persona mayor ya existe", { conflicts })
		}

		const data = {
			...req.body,
			password: defaulAdminPassword,
			validated: true,
			birthDate: new Date(req.body.birthDate),
			gender: Gender[req.body.gender as keyof typeof Gender],
		}

		const senior = await prisma.senior.create({
			data: data,
			select: seniorSelect,
		})

		return res.status(201).json({ values: { modified: senior } })
	} catch (error) {
		next(error)
	}
}

export const updateById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id
	const requestedUser = req.getExtension("requestedUser") as Senior

	const { name, email, password, address, birthDate } = req.body

	try {
		const userExists = await prisma.senior.findFirst({ where: { email } })

		if (userExists && userExists.id !== id) {
			throw new AppError(409, "La persona mayor ya existe", { conflicts: ["email"] })
		}

		const updatedPassword = password ? await hash(password, 10) : requestedUser.password

		const senior = await prisma.senior.update({
			where: { id: req.params.id },
			data: {
				name,
				email,
				password: updatedPassword,
				address,
				birthDate: new Date(birthDate),
			},
			select: seniorSelect,
		})

		const response = { modified: senior, image: null }

		if (req.file) {
			const storageResponse = await uploadProfilePicture({
				file: req.file,
				filename: req.params.id,
				endpoint: `/upload?path=%2Fseniors%2F${req.params.id}`,
			})

			if (storageResponse.type === "error") {
				throw new AppError(storageResponse.status || 500, storageResponse.message)
			}

			response.image = storageResponse.values.image
		}

		return res.status(200).json({ values: response })
	} catch (error) {
		next(error)
	}
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await prisma.event.updateMany({
			where: { seniorId: req.params.id },
			data: { seniorId: null },
		})

		const senior = await prisma.senior.delete({
			where: { id: req.params.id },
		})

		const storageResponse = await deleteProfilePicture(`/delete?path=%2Fseniors%2F${req.params.id}`)

		if (storageResponse.type === "error") {
			await prisma.senior.create({ data: senior })
			throw new AppError(storageResponse.status || 500, storageResponse.message)
		}

		return res.status(200).json({ values: { modified: senior } })
	} catch (error) {
		next(error)
	}
}

export const newSeniors = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const seniors = await prisma.senior.findMany({
			where: { validated: false },
		})

		return res.status(200).json({ values: seniors })
	} catch (error) {
		next(error)
	}
}

export const checkUnique = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { rut, email } = req.body

		if (!rut && !email) {
			return res.status(400).json({
				error: "Debe ingresar un valor en el campo.",
			})
		}

		const field = rut ? rut : email
		const senior = await prisma.senior.findFirst({
			where: {
				OR: [{ id: field }, { email: field }],
			},
		})

		if (senior) {
			throw new AppError(409, "La persona mayor ya existe", {
				rut: "Este rut ya está registrado, si se trata de un error por favor contacte a soporte.",
				email: "Esta dirección de correo ya está registrado, por favor ingrese otro.",
			})
		}
		return res.status(200).send()
	} catch (error) {
		next(error)
	}
}
