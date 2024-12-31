import { SessionRouter } from "./routes"
import { SessionSchemas } from "./schemas"
import { SessionController } from "./controller"
import { AuthenticationService, Module } from "@repo/lib"

export class SessionModule extends Module {
	public router: SessionRouter
	private controller: SessionController

	constructor(
		private auth: AuthenticationService,
		private schemas: SessionSchemas = new SessionSchemas(),
	) {
		super()
		this.controller = new SessionController(this.auth)
		this.router = new SessionRouter(this.auth, this.schemas, this.controller)
	}
}
