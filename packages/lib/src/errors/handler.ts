import { ZodError } from "zod"
import { AppError } from "./custom"
import { MulterError } from "multer"
import { JsonWebTokenError } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
	console.log("LOGGER: ", (err as Error).stack ?? "Uknown error from the error handler")

	if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
		return res.status(400).json({ message: "El o las imagenes son demasiado pesadas" })
	}

	if (err instanceof ZodError) {
		return res.status(400).json({ message: "Invalid fields", type: "error" })
	}

	if (err instanceof JsonWebTokenError) {
		return res.status(401).json({
			status: 401,
			message: "No autorizado",
			type: "error",
			values: null,
		})
	}

	if (!(err instanceof AppError)) {
		return res.status(500).json({ message: "Internal Server Error", type: "error" })
	}

	const jsonResponse = {
		status: err.code,
		message: err.message,
		type: "error",
		values: err.data ?? null,
	}

	return res.status(err.code).json(jsonResponse)
}
