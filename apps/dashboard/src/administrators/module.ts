import { AdministratorsRouter } from "./routes"
import { AdministratorsSchemas } from "./schemas"
import { AdministratorsController } from "./controllers"
import { AuthenticationService, MailerService, Module, StorageService } from "@repo/lib"

export class AdministratorsModule extends Module {
	public router: AdministratorsRouter
	public controller: AdministratorsController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private mailer: MailerService,
		private schemas: AdministratorsSchemas = new AdministratorsSchemas(),
	) {
		super()
		this.controller = new AdministratorsController(this.schemas, this.mailer, this.storage)
		this.router = new AdministratorsRouter(this.auth, this.schemas, this.controller)
	}
}
