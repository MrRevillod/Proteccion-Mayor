import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import cookieParser from "cookie-parser"

import centerRouter from "./routes/centers"
import accountRouter from "./routes/account"
import eventsRouter from "./routes/events"
import serviceRouter from "./routes/services"
import seniorsRouter from "./routes/seniors"
import reportsRouter from "./routes/reports"
import professionalsRouter from "./routes/professionals"
import administrarorsRouter from "./routes/administrators"
import "./cron/scheduleReminder";

import { Server } from "socket.io"
import { createServer } from "http"
import { initSocket } from "./utils/socket"
import { ServerToClientEvents } from "./socket"
import { log, services, errorHandler, extensions } from "@repo/lib"

export const createServer_ = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(cors({ origin: services.WEB_APP.url, credentials: true }))

	app.use(cookieParser())
	app.use(extensions)
	app.use("/api/dashboard/reports", reportsRouter)
	app.use("/api/dashboard/centers", centerRouter)
	app.use("/api/dashboard/seniors", seniorsRouter)
	app.use("/api/dashboard/services", serviceRouter)
	app.use("/api/dashboard/account", accountRouter)
	app.use("/api/dashboard/professionals", professionalsRouter)
	app.use("/api/dashboard/administrators", administrarorsRouter)
	app.use("/api/dashboard/seniors", seniorsRouter)
	app.use("/api/dashboard/events", eventsRouter)

	app.use(errorHandler)

	return app
}

const server = createServer_()
const http = createServer(server)

export const io = new Server<ServerToClientEvents>(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
	path: "/api/dashboard/socket.io",
	transports: ["websocket"],
})

initSocket(io)

http.listen(services.DASHBOARD.port, () => {
	log(`Dashboard service running on ${services.DASHBOARD.port}`)
})
