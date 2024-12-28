import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import cookieParser from "cookie-parser"

import { EventRouter } from "./routes/events"
import { CenterRouter } from "./routes/centers"
import { SeniorRouter } from "./routes/seniors"
import { ServiceRouter } from "./routes/services"
import { ProfessionalRouter } from "./routes/professionals"
import { AdministratorRouter } from "./routes/administrators"

import accountRouter from "./routes/account"
import reportsRouter from "./routes/reports"

import { setupWorker } from "@socket.io/sticky"
import { createServer } from "http"
import { SocketEvents } from "./socket"
import { createAdapter } from "@socket.io/cluster-adapter"
import { Server, Socket } from "socket.io"
import { log, services, errorHandler, extensions, UserRole } from "@repo/lib"

export const createApp = (): express.Express => {
	const app = express()

	app.use(helmet())
	app.use(morgan("dev"))
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(cors({ origin: "*", credentials: true }))

	app.use(cookieParser())
	app.use(extensions)

	const events = new EventRouter()
	const seniors = new SeniorRouter()
	const centers = new CenterRouter()
	const services = new ServiceRouter()
	const professionals = new ProfessionalRouter()
	const administrarors = new AdministratorRouter()

	app.use("/api/dashboard/events", events.router)
	app.use("/api/dashboard/centers", centers.router)
	app.use("/api/dashboard/seniors", seniors.router)
	app.use("/api/dashboard/services", services.router)
	app.use("/api/dashboard/professionals", professionals.router)
	app.use("/api/dashboard/administrators", administrarors.router)

	app.use("/api/dashboard/reports", reportsRouter)
	app.use("/api/dashboard/account", accountRouter)

	app.use(errorHandler)

	return app
}

const server = createApp()
const http = createServer(server)

export const io = new Server<SocketEvents>(http, {
	cors: {
		origin: services.WEB_APP.url,
		methods: ["GET", "POST"],
	},
	path: "/api/dashboard/socket.io",
	transports: ["websocket"],
})

if (process.env.NODE_ENV === "production") {
	io.adapter(createAdapter())
	setupWorker(io)
}

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
