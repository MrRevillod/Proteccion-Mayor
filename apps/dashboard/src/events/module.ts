import { EventsRouter } from "./routes"
import { EventsSchemas } from "./schemas"
import { EventsController } from "./controllers"
import { AuthenticationService, MailerService, Module } from "@repo/lib"

export class EventsModule extends Module {
	public router: EventsRouter
	private controller: EventsController

	constructor(
		private auth: AuthenticationService,
		private mailer: MailerService,
		private schemas: EventsSchemas = new EventsSchemas(),
	) {
		super()
		this.controller = new EventsController(this.schemas, this.mailer)
		this.router = new EventsRouter(this.auth, this.schemas, this.controller)
	}
}
