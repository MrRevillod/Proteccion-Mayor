import { OperativesRouter } from "./routes"
import { OperativesSchemas } from "./schemas"
import { OperativesController } from "./controllers"
import { AuthenticationService, MailerService, Module, StorageService } from "@repo/lib"
import { EventService } from "../events/service"

export class OperativesModule extends Module {
	public router: OperativesRouter
	public controller: OperativesController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private mailer: MailerService,
		private schemas: OperativesSchemas = new OperativesSchemas(),
	) {
		super()
		this.controller = new OperativesController(this.storage, this.schemas, new EventService(), this.mailer)
		this.router = new OperativesRouter(this.auth, this.schemas, this.controller)
	}
}
