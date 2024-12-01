import fs from "node:fs"
import cors from "cors"
import path from "node:path"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import router from "./router"
import cookieParser from "cookie-parser"

import { RequestHandler } from "express"
import { log, services, errorHandler, constants, AppError, httpRequest, AuthResponse, getServerTokens } from "@repo/lib"

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
	if (req.headers["x-storage-key"] !== constants.STORAGE_KEY) {
		next(new AppError(403, "No tiene permisos para acceder al servicio"))
	}
	next()
}

const verifyAuth: RequestHandler = async (req, res, next) => {
	const tokens = getServerTokens(req.headers, req.cookies)
	const authResponse = await httpRequest<AuthResponse>({
		service: "AUTH",
		endpoint: "/validate-role/ADMIN",
		headers: {
			Authorization: `Bearer ${tokens?.access || null}`,
		},
	})

	if (authResponse.type === "error") {
		next(new AppError(authResponse.status || 500, authResponse.message))
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
		if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
	})
}

export const createServer = (): express.Express => {
	initFileSystem()
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.json())
	app.use(cookieParser())
	app.use(express.urlencoded({ extended: true }))
	app.use(cors({ origin: "*", credentials: true }))

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

	seniorRouter.get("/:id/register-files", verifyAuth, (req, res) => {
		const imagePaths = [
			path.join(__dirname, `../public/seniors/${req.params.id}/dni-a.webp`),
			path.join(__dirname, `../public/seniors/${req.params.id}/dni-b.webp`),
			path.join(__dirname, `../public/seniors/${req.params.id}/social.webp`),
		]

		const images = imagePaths.map((imagePath) => {
			if (fs.existsSync(imagePath)) {
				const image = fs.readFileSync(imagePath)
				return `data:image/webp;base64,${image.toString("base64")}`
			}
		})

		res.status(200).json({ values: images })
	})

	app.use("/api/storage/public/seniors", seniorRouter)
	app.get("/api/storage/public/download-mobile-app", async (req, res, next) => {
		try {
			const filePath = path.join(__dirname, "../public/mobile/proteccion-mayor.apk")
			return res.download(filePath, "proteccion-mayor.apk")
		} catch (error) {
			next(error)
		}
	})

	app.use(
		"/api/storage/public/",
		(req, res, next) => {
			const filePath = path.join(__dirname, "../public", req.path.replace("/api/storage/public/", ""))
			if (!fs.existsSync(filePath)) {
				return res.status(404).json({ message: "Archivo no encontrado" })
			}
			next()
		},
		express.static(path.join(__dirname, "../public"), {
			fallthrough: false,
		}),
	)

	app.use("/api/storage/", verifyStorageKey, router)
	app.use(errorHandler)

	return app
}

const server = createServer()

server.listen(services.STORAGE.port, () => {
	log(`Storage running on ${services.STORAGE.port}`)
})
