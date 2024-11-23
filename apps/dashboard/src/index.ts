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

import { setupWorker } from "@socket.io/sticky"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { createAdapter } from "@socket.io/cluster-adapter"
import { ServerToClientEvents } from "./socket"
import { log, services, errorHandler, extensions, UserRole } from "@repo/lib"

export const createApp = (): express.Express => {
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

const server = createApp()
const http = createServer(server)

export const io = new Server<ServerToClientEvents>(http, {
	cors: {
		origin: services.WEB_APP.url,
		methods: ["GET", "POST"],
	},
	path: "/api/dashboard/socket.io",
	transports: ["websocket"],
})

io.adapter(createAdapter())
setupWorker(io)

io.on("connection", (socket: Socket) => {
	const role = socket.handshake.query.userRole as UserRole
	const userId = socket.handshake.query.userId as string

	socket.join(role)
	socket.join(userId)

	socket.on("disconnect", () => {
		socket.leave(role)
		socket.leave(userId)
	})
})

http.listen(services.DASHBOARD.port, () => {
	log(`Dashboard service running on ${services.DASHBOARD.port}`)
})
