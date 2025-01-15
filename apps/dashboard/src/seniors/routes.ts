import { SeniorSchemas } from "./schemas"
import { SeniorController } from "./controllers"
import { AuthenticationService, uploads } from "@repo/lib"
import { findSenior, Router, validations } from "@repo/lib"

import * as utils from "./utils"

export class SeniorRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: SeniorSchemas,
		private controller: SeniorController,
	) {
		super({ prefix: "/api/dashboard/seniors" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [this.auth.authorize(["ADMIN", "SENIOR","FUNCTIONARY"])],
		})

		this.post({
			path: "/pre-checked",
			handler: this.controller.createOne,
			middlewares: [this.auth.authorize(["ADMIN","FUNCTIONARY"]), validations.body(this.schemas.create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				uploads.singleImage,
				this.auth.authorize(["ADMIN", "SENIOR","FUNCTIONARY"]),
				validations.resourceId(findSenior),
				validations.body(this.schemas.update),
				validations.files({ required: false }),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [
				this.auth.authorize(["ADMIN", "SENIOR","FUNCTIONARY"]),
				validations.resourceId(findSenior),
				utils.validatePassword,
			],
		})

		this.post({
			path: "/new-mobile",
			handler: this.controller.createMobile,
			middlewares: [
				uploads.mobileregisterFiles,
				validations.body(this.schemas.mobileRegister),
				validations.files({ required: true }),
			],
		})

		this.patch({
			path: "/:id/new",
			handler: this.controller.handleRegisterRequest,
			middlewares: [
				this.auth.authorize(["ADMIN","FUNCTIONARY"]),
				validations.resourceId(findSenior),
				validations.body(this.schemas.handleRegisterRequest),
			],
		})

		this.post({
			path: "/check-unique",
			handler: this.controller.checkUnique,
		})
	}
}
