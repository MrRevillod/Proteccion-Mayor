import { ReportsController } from "./controllers"
import { AuthenticationService, Router } from "@repo/lib"

export class ReportsRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private controller: ReportsController,
	) {
		super({ prefix: "/api/dashboard/reports" })

		this.get({
			path: "/",
			handler: this.controller.generateStatisticReport,
			middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL"])],
		})
	}
}
