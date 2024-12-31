import { hash } from "bcrypt"
import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { Prisma, Senior } from "@prisma/client"
import { SeniorSchemas } from "./schemas"
import { StorageService, MailerService, templates } from "@repo/lib"
import { AppError, Controller, Conflict, credentials } from "@repo/lib"

export class SeniorController {
	constructor(
		private schemas: SeniorSchemas,
		private storage: StorageService,
		private mailer: MailerService,
	) {}

	public getMany: Controller = async (req, res, handleError) => {
		const query = this.schemas.query.parse(req.query)

		try {
			const orConditions: Prisma.SeniorWhereInput[] = []

			if (query.id) {
				orConditions.push({ id: { contains: query.id } })
			}

			if (query.name) {
				orConditions.push({ name: { contains: query.name } })
			}

			if (query.email) {
				orConditions.push({ email: { contains: query.email } })
			}

			const seniors = await prisma.senior.findMany({
				take: query.limit,
				select: query.select,
				where: {
					...(query.validated && { validated: query.validated === "1" }),
					...(orConditions.length > 0 && { OR: orConditions }),
				},
			})

			return res.status(200).json({ values: seniors })
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * Controlador para crear una persona mayor desde la aplicación web por
	 * parte de un administrador
	 *
	 * @param req (Express Request)
	 * @param res (Express Response)
	 * @param handleError (Express NextFunction)
	 *
	 * @returns (Express Response)
	 * @throws (AppError)
	 */

	public createOne: Controller = async (req, res, handleError) => {
		const { id, name, email } = req.body

		try {
			// Verificar si la persona mayor ya existe en la base de datos
			const exists = await prisma.senior.findFirst({
				where: { OR: [{ id }, { email }] },
			})

			if (exists) {
				const conflicts = new Array<string>()
				if (exists.id === id) conflicts.push("id")
				if (exists.email === email) conflicts.push("email")
				throw new Conflict("La persona mayor ya existe", { conflicts })
			}

			const [randomPin, hashedRandomPin] = await credentials.generatePin()

			const data = {
				...req.body, // id, name, email, address, gender
				validated: true,
				password: hashedRandomPin,
				birthDate: new Date(req.body.birthDate),
			}

			const senior = await prisma.senior.create({
				data,
				select: this.schemas.defaultSelect,
			})

			this.mailer.send({
				to: email as string,
				subject: "Bienvenido a Protección Mayor",
				html: templates.seniorCredentialsWelcome(name, id, randomPin),
			})

			return res.status(201).json({ values: { modified: senior } })
		} catch (error) {
			handleError(error)
		}
	}

	public updateOne: Controller = async (req, res, handleError) => {
		const { body, params } = req
		const { name, email, password, address, birthDate } = body

		const requestedUser = req.getExtension("reqResource") as Senior

		try {
			const exists = await prisma.senior.findFirst({
				where: { email, id: { not: params.id } },
			})

			if (exists) {
				throw new Conflict("La persona mayor ya existe", { conflicts: ["email"] })
			}

			const updatedPassword = password ? await hash(password, 10) : requestedUser.password

			const senior = await prisma.senior.update({
				where: { id: params.id },
				data: {
					name,
					email,
					password: updatedPassword,
					address,
					birthDate: new Date(birthDate),
				},
				select: this.schemas.defaultSelect,
			})

			const response = { modified: senior, image: "" }

			if (req.file) {
				const storageResponse = await this.storage.uploadFile({
					input: req.file,
					url: `/upload?path=%2Fseniors%2F${params.id}`,
					filename: params.id,
				})

				response.image = storageResponse.image
			}

			return res.status(200).json({ values: response })
		} catch (error) {
			handleError(error)
		}
	}

	public deleteOne: Controller = async (req, res, handleError) => {
		try {
			await prisma.event.updateMany({
				where: { seniorId: req.params.id },
				data: { seniorId: null },
			})

			const senior = await prisma.senior.delete({
				where: { id: req.params.id },
			})

			await this.storage.deleteFile({
				url: `/delete?path=%2Fseniors%2F${req.params.id}`,
			})

			return res.status(200).json({ values: { modified: senior } })
		} catch (error) {
			handleError(error)
		}
	}

	public checkUnique: Controller = async (req, res, handleError) => {
		const { rut, email } = req.body

		try {
			if (!rut && !email) throw new AppError(400, "Debe ingresar un valor en el campo.")

			const senior = await prisma.senior.findFirst({
				where: {
					OR: [{ id: rut ?? undefined }, { email: email ?? undefined }],
				},
			})

			if (!senior) return res.status(200).json({ values: {} })

			if (rut && senior.id === rut) {
				return res.status(409).json({ values: { rut: "Este rut ya está registrado." } })
			}

			if (email && senior.email === email) {
				return res
					.status(409)
					.json({ values: { email: "Este correo ya está registrado." } })
			}
		} catch (error) {
			handleError(error)
		}
	}

	public createMobile: Controller = async (req, res, handleError) => {
		const { rut, pin, email } = req.body

		try {
			const exists = await prisma.senior.findFirst({
				where: { OR: [{ id: rut }, { email }] },
			})

			if (exists) throw new Conflict("La persona que estas tratando de registrar ya existe")

			if (!req.files || Object.keys(req.files).length === 0) {
				throw new AppError(400, "No se han enviado archivos")
			}

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

			await this.storage.uploadFiles({
				input: req.files as Record<string, Express.Multer.File[]>,
				url: `/upload?path=%2Fseniors%2F${rut}`,
			})

			return res.status(201).json({ values: { message: "Registro exitoso" } })
		} catch (error) {
			handleError(error)
		}
	}

	public handleRegisterRequest: Controller = async (req, res, handleError) => {
		const { params, body, query } = req

		const { validate } = query
		const { name, address, birth, gender } = body

		try {
			const senior = await prisma.senior.findUnique({ where: { id: params.id } })

			if (!senior) throw new AppError(400, "Adulto mayor no encontrado")
			if (senior.validated) throw new AppError(409, "Esta solicitud ya ha sido validada")

			const data = {
				name,
				address,
				gender,
				validated: true,
				birthDate: new Date(birth),
			}

			const emailData = {
				to: senior.email as string,
				subject: "",
				html: "",
			}

			await match(validate)
				.with("true", () => {
					emailData.subject = "Solictud de registro aceptada"
					emailData.html = templates.seniorWelcome(name)

					return prisma.senior.update({ data, where: { id: params.id } })
				})
				.with("false", () => {
					emailData.subject = "Solicitud de registro rechazada"
					emailData.html = templates.registerDenegation(name)

					return prisma.senior.delete({ where: { id: params.id } })
				})
				.otherwise(() => {
					throw new AppError(400, "El campo 'validate' debe ser 'true' o 'false'")
				})

			this.mailer.send(emailData)

			return res.status(200).json({ message: emailData.subject, values: {} })
		} catch (error) {
			handleError(error)
		}
	}
}
