import { prisma } from "@repo/database"
import { compare, hash } from "bcrypt"
import { Helper } from "@prisma/client"
import { StaffSchemas } from "./schemas"
import { MailerService, StorageService, templates } from "@repo/lib"
import { AppError, Conflict, Controller, credentials } from "@repo/lib"

export class HelpersController {
	constructor(
		private schemas: StaffSchemas,
		private mailer: MailerService,
		private storage: StorageService,
	) {}

	public getMany: Controller = async (req, res, handleError) => {
		try {
			const helpers = await prisma.helper.findMany({
				select: this.schemas.defaultSelect,
			})

			return res.status(200).json({ values: helpers })
		} catch (error) {
			handleError(error)
		}
	}

	public createOne: Controller = async (req, res, handleError) => {
		const { id, name, email } = req.body

		try {
			const exists = await prisma.helper.findFirst({
				where: { OR: [{ id }, { email }] },
			})

			if (exists) {
				const conflicts = []
				if (exists?.id === id) conflicts.push("id")
				if (exists?.email === email) conflicts.push("email")
				throw new AppError(409, "El administrador ya existe", { conflicts })
			}

			const [password, hash] = await credentials.generatePassword()
			const helper = await prisma.helper.create({
				data: { id, name, email, password: hash },
				select: this.schemas.defaultSelect,
			})

			this.mailer.send({
				to: email,
				subject: "Bienvenido a Protección Mayor",
				html: templates.welcome(name, email, password),
			})

			return res.status(201).json({ values: { modified: helper } })
		} catch (error) {
			handleError(error)
		}
	}

	public updateOne: Controller = async (req, res, handleError) => {
		const { params, body, file } = req
		const { name, email, password } = body

        const reqUser = req.getExtension("reqResource") as Helper

		try {
			const exists = await prisma.helper.findFirst({
				where: { email, id: { not: params.id } },
			})

			if (exists) {
				throw new Conflict("El funcionario ya existe", { conflicts: ["email"] })
			}

			const updatedPassword = password ? await hash(password, 10) : reqUser.password

            
			const helper = await prisma.helper.update({
				where: { id: params.id },
				data: {
					name,
					email,
					password: updatedPassword,
				},
				select: this.schemas.defaultSelect,
			})

			const response = { modified: helper, image: null }

			if (file) {
				const storage = await this.storage.uploadFile({
					input: file,
					url: `/upload?path=%2Fusers%2F${params.id}`,
					filename: params.id,
				})

				response.image = storage.image as any
			}

			return res.status(200).json({ values: response })
		} catch (error) {
			handleError(error)
		}
	}

	public deleteOne: Controller = async (req, res, handleError) => {
		const { params } = req

		try {
			const helper = await prisma.helper.delete({
				where: { id: params.id },
				select: this.schemas.defaultSelect,
			})

			await this.storage.deleteFile({
				url: `/delete?path=%2Fusers%2F${params.id}`,
			})

			return res.status(200).json({ values: { modified: helper } })
		} catch (error) {
			handleError(error)
		}
	}

	public confirmAction: Controller = async (req, res, handleError) => {
		const password = req.body.password
		const user = req.getExtension("user") as Helper

		try {
			if (!password) throw new AppError(400, "Por favor, ingrese su contraseña")

			const passwordMatch = await compare(password, user.password)
			if (!passwordMatch) throw new AppError(401, "Contraseña incorrecta")

			return res.status(200).json({ message: "OK" })
		} catch (error) {
			handleError(error)
		}
	}


}
