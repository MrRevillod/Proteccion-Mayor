import { SectorsRouter } from "./routes"
import { SectorSchemas } from "./schemas"
import { SectorsController } from "./controllers"
import { AuthenticationService, Module } from "@repo/lib"

export class SectorsModule extends Module {
	public router: SectorsRouter
	private controller: SectorsController

	constructor(
		private auth: AuthenticationService,
		private schemas: SectorSchemas = new SectorSchemas(),
	) {
		super()

		this.controller = new SectorsController(this.schemas)
		this.router = new SectorsRouter(this.auth, this.schemas, this.controller)
	}
}
