import { RequestHandler } from "express"
import { AppError, CONSTANTS } from "@repo/lib"

import fs from "node:fs"
import path from "node:path"

export const verifyStorageKey: RequestHandler = (req, res, next) => {
	if (req.headers["x-storage-key"] !== CONSTANTS.STORAGE_KEY) {
		next(new AppError(403, "No tiene permisos para acceder al servicio"))
	}
	next()
}

export const initFileSystem = (): void => {
	const publicPath = path.join(__dirname, "../public") // __dirname => directorio actual

	const seniorsPath = path.join(publicPath, "seniors")
	const usersPath = path.join(publicPath, "users")
	const servicesPath = path.join(publicPath, "services")
	const centersPath = path.join(publicPath, "centers")

	const paths = [publicPath, seniorsPath, usersPath, servicesPath, centersPath]

	paths.forEach((path) => {
		if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
	})
}
