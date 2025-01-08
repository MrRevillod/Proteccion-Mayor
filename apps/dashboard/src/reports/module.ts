import { ReportsRouter } from "./routes"
import { ReportsService } from "./service"
import { ReportsController } from "./controllers"
import { AuthenticationService, Module } from "@repo/lib"

export class ReportsModule extends Module {
	public router: ReportsRouter
	private controller: ReportsController

	constructor(
		private auth: AuthenticationService,
		private reportsService: ReportsService = new ReportsService(),
	) {
		super()
		this.controller = new ReportsController(this.reportsService)
		this.router = new ReportsRouter(this.auth, this.controller)
	}
}
