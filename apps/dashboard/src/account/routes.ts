import { Router } from "@repo/lib"
import { AccountController } from "./controllers"

export class AccountRouter extends Router {
	constructor(private controller: AccountController) {
		super({ prefix: "/api/dashboard/account" })

		this.post({
			path: "/reset-password",
			handler: this.controller.requestPasswordReset,
		})

		this.post({
			path: "/reset-password/:id/:token/:role",
			handler: this.controller.resetPassword,
		})

		this.get({
			path: "/reset-password/:id/:token/:role",
			handler: this.controller.compareLinkToken,
		})
	}
}
