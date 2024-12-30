import { Router } from "@repo/lib"
import { SeniorSchemas } from "./schemas"
import { filesValidation } from "../middlewares/file"
import { SeniorController } from "./controllers"
import { AuthenticationService } from "@repo/lib"
import { validateSchema, validateUserId } from "../middlewares/validation"
import { seniorsRegisterMobileImages, singleImageupload } from "../config"

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
			middlewares: [this.auth.authorize(["ADMIN", "SENIOR"])],
		})

		this.post({
			path: "/pre-checked",
			handler: this.controller.createOne,
			middlewares: [this.auth.authorize(["ADMIN"]), validateSchema(this.schemas.create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				singleImageupload,
				this.auth.authorize(["ADMIN", "SENIOR"]),
				validateUserId("SENIOR"),
				validateSchema(this.schemas.update),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN", "SENIOR"]), validateUserId("SENIOR")],
		})

		this.post({
			path: "/new-mobile",
			handler: this.controller.createMobile,
			middlewares: [
				seniorsRegisterMobileImages,
				validateSchema(this.schemas.mobileRegister),
				filesValidation,
			],
		})

		this.patch({
			path: "/:id/new",
			handler: this.controller.handleRegisterRequest,
			middlewares: [this.auth.authorize(["ADMIN"]), validateUserId("SENIOR")],
		})

		this.post({
			path: "/check-unique",
			handler: this.controller.checkUnique,
		})
	}
}
