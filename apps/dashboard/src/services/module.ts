import { ServicesRouter } from "./routes"
import { ServicesSchemas } from "./schemas"
import { ServicesController } from "./controllers"
import { AuthenticationService, Module, StorageService } from "@repo/lib"

export class ServicesModule extends Module {
	public router: ServicesRouter
	private controller: ServicesController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private schemas: ServicesSchemas = new ServicesSchemas(),
	) {
		super()
		this.controller = new ServicesController(this.storage, this.schemas)
		this.router = new ServicesRouter(this.auth, this.schemas, this.controller)
	}
}
