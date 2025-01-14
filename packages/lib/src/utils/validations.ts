import { z } from "zod"
import { BadRequest } from "../errors/custom"
import { CONSTANTS, jwt, rules, users } from ".."
import { validateBufferMIMEType } from "validate-image-type"
import { Request, Response, NextFunction } from "express"
import { FileMiddleware, Middleware, SchemaBasedMiddleware, UserRole } from "../types"

export const body: SchemaBasedMiddleware = (schema) => (req, res, next) => {
	console.log(req.body)
	try {
		schema.parse(req.body)
		next()
	} catch (error: any) {
		next(new BadRequest(error))
	}
}

export const files: FileMiddleware =
	({ required }) =>
	async (req, res, next) => {
		const fileWhitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
		const validateMimeType = (file: Express.Multer.File) => {
			return validateBufferMIMEType(file.buffer, { allowMimeTypes: fileWhitelist })
		}

		try {
			if (!required && !req.files) {
				return next()
			}

			if (!req.files && !req.file && required) {
				return next(new BadRequest("No se ha enviado ningún archivo"))
			}

			if (req.files) {
				const files = req.files as { [fieldname: string]: Express.Multer.File[] }
				Object.keys(files).forEach(async (fieldname) => {
					const file = files[fieldname][0]
					if (!(await validateMimeType(file)).ok) {
						throw new BadRequest("Tipo de archivo no permitido")
					}
				})
			}

			if (req.file) {
				if (!(await validateMimeType(req.file)).ok) {
					throw new BadRequest("Tipo de archivo no permitido")
				}
			}

			next()
		} catch (error) {
			next(error)
		}
	}

export const resourceId =
	(fn: (id: string) => Promise<any>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const exists = await fn(req.params.id)
			if (!exists) {
				throw new BadRequest("El recurso solicitado no existe")
			}

			req.setExtension("reqResource", exists)

			next()
		} catch (error) {
			next(error)
		}
	}

export const resetPasswordRequest: Middleware = async (req, res, next) => {
	const { id, token, role } = req.params

	try {
		if (!id || !token || !role) {
			throw new BadRequest("Faltan parámetros necesarios para la operación")
		}

		const rolePayload = jwt.verify(role)

		if (!rolePayload.role || !users.isValidRole(rolePayload.role)) {
			throw new BadRequest("Solicitud inválida")
		}

		const user = await users.find({
			filter: { id },
			role: rolePayload.role,
		})

		if (!user) throw new BadRequest("Usuario no encontrado")
		jwt.verify(token, `${CONSTANTS.JWT_SECRET}${user?.password}`)

		const userRole = rolePayload.role as UserRole

		z.object({
			password: userRole === "SENIOR" ? rules.pinSchema : rules.passwordSchema,
			confirmPassword: userRole === "SENIOR" ? rules.pinSchema : rules.passwordSchema,
		})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Las contraseñas ingresadas no coinciden",
				path: ["confirmPassword"],
			})
			.parse(req.body)

		next()
	} catch (error) {
		next(error)
	}
}
