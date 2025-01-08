import { findCenter, Router } from "@repo/lib"
import { CentersSchemas } from "./schemas"
import { CentersController } from "./controllers"
import { AuthenticationService, validations, uploads } from "@repo/lib"

export class CentersRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: CentersSchemas,
		private controller: CentersController,
	) {
		super({ prefix: "/api/dashboard/centers" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL"])],
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
				validations.resourceId(findCenter),
				validations.body(this.schemas.update),
				validations.files({ required: false }),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN"]), validations.resourceId(findCenter)],
		})
	}
}
