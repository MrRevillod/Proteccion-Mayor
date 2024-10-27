import fs from "node:fs"
import cors from "cors"
import path from "node:path"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import router from "./router"

import { RequestHandler } from "express"
import { log, services, errorHandler, constants, AppError } from "@repo/lib"

// Sistema de archivos de el microservicio de almacenamiento

// /public | /var/www/public (desarrollo | producción)

// -- /seniors
// ---- /id
// ------ dni-a.jpg -> Protegida
// ------ dni-b.jpg -> Protegida
// ------ social.jpg -> Protegida
// ------ profile.jpg

// -- /users
// ---- profile-id.jpg
// ---- profile-default.jpg

// -- /services
// ---- image-id.jpg

// -- /centers
// ---- image-id.jpg

// Las imagenes son transformadas a formato webp con calidad 80
// Un upload de una imagen con el mismo nombre sobreescribe la anterior

const verifyStorageKey: RequestHandler = (req, res, next) => {
	console.log(req.headers.authorization)
	if (req.headers["x-storage-key"] !== constants.STORAGE_KEY) {
		next(new AppError(403, "No tiene permisos para acceder al servicio"))
	}
	next()
}

const initFileSystem = (): void => {
	// __dirname => directorio actual
	const publicPath = path.join(__dirname, "../public")
	const seniorsPath = path.join(publicPath, "seniors")
	const usersPath = path.join(publicPath, "users")
	const servicesPath = path.join(publicPath, "services")
	const centersPath = path.join(publicPath, "centers")

	const paths = [publicPath, seniorsPath, usersPath, servicesPath, centersPath]

	paths.forEach((path) => {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true })
		}
	})
}

export const createServer = (): express.Express => {
	initFileSystem()
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(
		cors({
			origin: "*",
			credentials: true,
		}),
	)

	// ----------------- Rutas privadas ------------------
	// /api/storage/upload
	// /api/storage/delete
	// /api/storage/public/seniors/id/social.webp
	// /api/storage/public/seniors/id/dni-a.webp
	// /api/storage/public/seniors/id/dni-b.webp
	// ---------------------------------------------------

	// ----------------- Rutas públicas ------------------
	// /api/storage/public/* ![seniors] /*.webp
	// ---------------------------------------------------

	const seniorRouter = express.Router()

	seniorRouter.get("/:id/social.webp", verifyStorageKey, (req, res) => {
		res.sendFile(path.join(__dirname, "../public/seniors", req.params.id, "social.webp"))
	})
	seniorRouter.get("/:id/dni-a.webp", verifyStorageKey, (req, res) => {
		res.sendFile(path.join(__dirname, "../public/seniors", req.params.id, "dni-a.webp"))
	})
	seniorRouter.get("/:id/dni-b.webp", verifyStorageKey, (req, res) => {
		res.sendFile(path.join(__dirname, "../public/seniors", req.params.id, "dni-b.webp"))
	})

	app.use("/api/storage/public/seniors", seniorRouter)
	app.use("/api/storage/public/", express.static(path.join(__dirname, "../public")))

	app.use("/api/storage/", verifyStorageKey, router)

	app.use(errorHandler)

	return app
}

const server = createServer()

server.listen(services.STORAGE.port, () => {
	log(`Storage running on ${services.STORAGE.port}`)
})
