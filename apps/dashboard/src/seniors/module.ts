import { SeniorRouter } from "./routes"
import { SeniorSchemas } from "./schemas"
import { SeniorController } from "./controllers"
import { AuthenticationService, MailerService, Module, StorageService } from "@repo/lib"

export class SeniorsModule extends Module {
	public router: SeniorRouter
	private controller: SeniorController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private mailer: MailerService,
		private schemas: SeniorSchemas = new SeniorSchemas(),
	) {
		super()
		this.controller = new SeniorController(this.schemas, this.storage, this.mailer)
		this.router = new SeniorRouter(this.auth, this.schemas, this.controller)
	}
}
