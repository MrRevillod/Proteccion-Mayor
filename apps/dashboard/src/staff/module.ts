import { StaffRouter } from "./routes"
import { StaffSchemas } from "./schemas"
import { StaffController } from "../staff/controllers"
import { AuthenticationService, MailerService, Module, StorageService } from "@repo/lib"

export class StaffModule extends Module {
	public router: StaffRouter
	public controller: StaffController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private mailer: MailerService,
		private schemas: StaffSchemas = new StaffSchemas(),
	) {
		super()
		this.controller = new StaffController(this.mailer, this.storage)
		this.router = new StaffRouter(this.auth, this.schemas, this.controller)
	}
}
