import { Request, Response, NextFunction } from "express"
import path from "path"
import { AppError } from "@repo/lib"

export const downloadApk = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const filePath = path.join(__dirname, "../../storage/app.apk")

		res.download(filePath, "app.apk", (err) => {
			if (err) {
				return next(new AppError(500, "Error al descargar el archivo"))
			}
		})
	} catch (error) {
		next(error)
	}
}
