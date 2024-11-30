import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import router from "./routes"
import cookieParser from "cookie-parser"

import { log, services, errorHandler, extensions } from "@repo/lib"

export const createServer = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(cookieParser())
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(cors({ origin: "*", credentials: true }))

	app.use(extensions)
	app.use("/api/auth", router)
	app.use(errorHandler)

	return app
}

const server = createServer()

server.listen(services.AUTH.port, () => {
	log(`Auth microservice running on ${services.AUTH.url}`)
})
