import { CentersRouter } from "./routes"
import { CentersSchemas } from "./schemas"
import { CentersController } from "./controllers"
import { AuthenticationService, Module, StorageService } from "@repo/lib"

export class CentersModule extends Module {
	public router: CentersRouter
	private controller: CentersController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private schemas: CentersSchemas = new CentersSchemas(),
	) {
		super()
		this.controller = new CentersController(this.schemas, this.storage)
		this.router = new CentersRouter(this.auth, this.schemas, this.controller)
	}
}
