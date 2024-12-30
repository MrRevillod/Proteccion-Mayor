import { AccountRouter } from "./routes"
import { AccountController } from "./controllers"
import { AuthenticationService, MailerService, Module } from "@repo/lib"

export class AccountModule extends Module {
	public router: AccountRouter
	private controller: AccountController

	constructor(
		private auth: AuthenticationService,
		private mailer: MailerService,
	) {
		super()
		this.controller = new AccountController(this.auth, this.mailer)
		this.router = new AccountRouter(this.controller)
	}
}
