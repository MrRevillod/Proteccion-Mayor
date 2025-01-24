import { OperativesRouter } from "./routes"
import { OperativesSchemas } from "./schemas"
import { OperativesController } from "./controllers"
import { AuthenticationService, Module, StorageService } from "@repo/lib"

export class OperativesModule extends Module {
	public router: OperativesRouter
	public controller: OperativesController

	constructor(
		private auth: AuthenticationService,
		private storage: StorageService,
		private schemas: OperativesSchemas = new OperativesSchemas(),
	) {
		super()
		this.controller = new OperativesController(this.storage, this.schemas)
		this.router = new OperativesRouter(this.auth, this.schemas, this.controller)
	}
}
