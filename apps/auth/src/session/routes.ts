import { SessionSchemas } from "./schemas"
import { SessionController } from "./controller"
import { AuthenticationService, Router, validations } from "@repo/lib"

export class SessionRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: SessionSchemas,
		private controller: SessionController,
	) {
		super({ prefix: "/api/auth" })

		this.post({
			path: "/login",
			middlewares: [validations.body(this.schemas.webLogin)],
			handler: this.controller.webLogin,
		})

		this.post({
			path: "/login-senior",
			middlewares: [validations.body(this.schemas.mobileLogin)],
			handler: this.controller.mobileLogin,
		})

		this.get({
			path: "/refresh",
			handler: this.controller.refresh,
		})

		this.post({
			path: "/logout",
			middlewares: [this.auth.authorize()],
			handler: this.controller.logout,
		})

		this.get({
			path: "/validate-auth",
			middlewares: [this.auth.authorize()],
			handler: this.controller.validate,
		})

		this.get({
			path: "/health",
			handler: (req, res) => {
				res.status(200).send("OK")
			},
		})
	}
}
