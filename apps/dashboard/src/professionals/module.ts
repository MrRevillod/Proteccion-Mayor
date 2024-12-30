import { ProfessionalsRouter } from "./routes"
import { ProfessionalsSchemas } from "./schemas"
import { ProfessionalsController } from "./controllers"
import { AuthenticationService, MailerService, Module, StorageService } from "@repo/lib"

export class ProfessionalsModule extends Module {
	public router: ProfessionalsRouter
	private controller: ProfessionalsController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private mailer: MailerService,
		private schemas: ProfessionalsSchemas = new ProfessionalsSchemas(),
	) {
		super()
		this.controller = new ProfessionalsController(this.schemas, this.storage, this.mailer)
		this.router = new ProfessionalsRouter(this.auth, this.schemas, this.controller)
	}
}
