import { EventsModule } from "./events/module"
import { SeniorsModule } from "./seniors/module"
import { CentersModule } from "./centers/module"
import { ReportsModule } from "./reports/module"
import { ServicesModule } from "./services/module"
import { ProfessionalsModule } from "./professionals/module"
import { AdministratorsModule } from "./administrators/module"
import { HelpersModule } from "./helpers/module"

import { setupWorker } from "@socket.io/sticky"
import { createServer } from "http"
import { SocketEvents } from "./socket"
import { createAdapter } from "@socket.io/cluster-adapter"
import { Server, Socket } from "socket.io"
import { MailerService, SERVICES, startService, UserRole } from "@repo/lib"
import { AuthenticationService, createApplication, StorageService } from "@repo/lib"

const authService = new AuthenticationService()
const mailerService = new MailerService()
const storageService = new StorageService()

const modules = [
	new EventsModule(authService, mailerService),
	new SeniorsModule(authService, storageService, mailerService),
	new ReportsModule(authService),
	new ServicesModule(authService, storageService),
	new CentersModule(authService, storageService),
	new ProfessionalsModule(authService, storageService, mailerService),
    new AdministratorsModule(authService, storageService, mailerService),
    new HelpersModule(authService, storageService, mailerService),
]

const app = createApplication(modules)
const http = createServer(app)

export const io = new Server<SocketEvents>(http, {
	cors: {
		origin: SERVICES.WEB_APP.URL,
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

http.listen(SERVICES.DASHBOARD.PORT, () => {
	startService("DASHBOARD", SERVICES.DASHBOARD.URL, SERVICES.DASHBOARD.PORT)
})
