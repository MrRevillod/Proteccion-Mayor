import { HelpersRouter } from "./routes"
import { HelpersSchemas } from "./schemas"
import { HelpersController } from "./controllers"
import { AuthenticationService, MailerService, Module, StorageService } from "@repo/lib"

export class HelpersModule extends Module {
	public router: HelpersRouter
    public controller: HelpersController
    

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private mailer: MailerService,
		private schemas: HelpersSchemas = new HelpersSchemas(),
	) {
		super()
		this.controller = new HelpersController(this.schemas, this.mailer, this.storage)
		this.router = new HelpersRouter(this.auth, this.schemas, this.controller)
	}
}
