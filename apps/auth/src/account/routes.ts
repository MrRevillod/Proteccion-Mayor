import { AccountSchemas } from "./schemas"
import { AccountController } from "./controllers"
import { Router, validations } from "@repo/lib"

export class AccountRouter extends Router {
	constructor(
		private controller: AccountController,
		private schema: AccountSchemas = new AccountSchemas(),
	) {
		super({ prefix: "/api/auth/account" })

		this.post({
			path: "/reset-password",
			handler: this.controller.requestPasswordReset,
			middlewares: [validations.body(this.schema.resetPasswordRequest)],
		})

		this.post({
			path: "/reset-password/:id/:token/:role",
			handler: this.controller.resetPassword,
			middlewares: [validations.resetPasswordRequest],
		})

		this.get({
			path: "/reset-password/:id/:token/:role",
			handler: this.controller.compareLinkToken,
		})
	}
}
