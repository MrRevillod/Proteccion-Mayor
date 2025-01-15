import fs from "node:fs"
import path from "node:path"
import router from "./router"
import express from "express"

import { Router } from "express"
import { verifyStorageKey } from "./utils"
import { createApplication, startService } from "@repo/lib"
import { SERVICES, AuthenticationService } from "@repo/lib"

// Las imagenes son transformadas a formato webp con calidad 80
// Un upload de una imagen con el mismo nombre sobreescribe la anterior

// ----------------- Rutas privadas ------------------
// /api/storage/upload?path -> Subir archivos
// /api/storage/delete?path -> Eliminar archivos

// /api/storage/public/seniors/id/register-files -> Obtener imagenes de registro
// ---------------------------------------------------

// ----------------- Rutas públicas ------------------
// /api/storage/public/* ![seniors] /*.webp
// ---------------------------------------------------

const app = createApplication()
const auth = new AuthenticationService()
const seniorRouter = Router()

seniorRouter.get("/:id/register-files", auth.authorize(["ADMIN","FUNCTIONARY"]), (req, res) => {
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

app.listen(SERVICES.STORAGE.PORT, () => {
	startService("STORAGE", SERVICES.STORAGE.URL, SERVICES.STORAGE.PORT)
})
