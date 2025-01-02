import { BadRequest } from "../errors/custom"
import { validateBufferMIMEType } from "validate-image-type"
import { Request, Response, NextFunction } from "express"
import { FileMiddleware, SchemaBasedMiddleware } from "../types"

export const body: SchemaBasedMiddleware = (schema) => (req, res, next) => {
	try {
		schema.parse(req.body)
		next()
	} catch (error) {
		next(new BadRequest("Error en la validación de campos en el formulario"))
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
