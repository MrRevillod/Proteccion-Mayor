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
			handler: this.controller.generateRangeStats,
			middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL"])],
		})

		this.get({
			path: "/report-document",
			handler: this.controller.generateRangeDocument,
			middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL"])],
		})
	}
}
