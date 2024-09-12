import { NextFunction, Request, Response } from "express"
import { fileWhitelist } from "../config"
import { validateBufferMIMEType } from "validate-image-type"
import { AppError, log } from "@repo/lib"

export const fileValidation = async (req: Request, res: Response, next: NextFunction) => {
	const files = req.files as {
		[fieldname: string]: Express.Multer.File[]
	}

	log(files)
	try {
		const filenames = ["dni-a", "dni-b", "social"]
		filenames.forEach(async (filename) => {
			if (!files[filename] || files[filename][0] === undefined) {
				throw new AppError(400, "No se enviaron los archivos requeridos")
			}
			const isValidate = await validateBufferMIMEType(files[filename][0].buffer, {
				allowMimeTypes: fileWhitelist,
			})
            
			if (!isValidate.ok) {
                res.status(400).json({
                    message:"Error de formato"
                })
				
			}
		})
		next()
    } catch (error) {
		next(error)
	}
}