import { Router, uploads } from "@repo/lib"
import { AuthenticationService, validations, findOperative } from "@repo/lib"
import { OperativesController } from "./controllers"
import { OperativesSchemas } from "./schemas"

export class OperativesRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: OperativesSchemas,
		private controller: OperativesController,
	) {
		super({ prefix: "/api/dashboard/operatives" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [this.auth.authorize(["ADMIN"])],
		})

		this.post({
			path: "/",
			handler: this.controller.createOne,
			middlewares: [
				uploads.singleImage,
				this.auth.authorize(["ADMIN"]),
				validations.body(this.schemas.create),
				validations.files({ required: true }),
			],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				uploads.singleImage,
				this.auth.authorize(["ADMIN"]),
				validations.body(this.schemas.update),
				validations.resourceId(findOperative),
				validations.files({ required: false }),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN"]), validations.resourceId(findOperative)],
		})

		this.post({
			path: "/confirm-action",
			handler: this.controller.confirmAction,
			middlewares: [this.auth.authorize(["ADMIN"])],
		})
	}
}
