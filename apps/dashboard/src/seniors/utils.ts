import { compare } from "bcrypt"
import { Senior } from "@prisma/client"
import { RequestHandler } from "express"
import { BadRequest, Unauthorized } from "@repo/lib"

export const validatePassword: RequestHandler = async (req, res, next) => {
	const senior = req.getExtension("reqResource") as Senior
	const password = req.query.credentials

	try {
		if (!password) throw new BadRequest("Contraseña requerida")
		const match = await compare(password.toString(), senior.password)
		if (!match) throw new Unauthorized("Contraseña incorrecta")

		next()
	} catch (error) {
		next(error)
	}
}
