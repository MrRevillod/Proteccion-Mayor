import { ServicesSchemas } from "./schemas"
import { ServicesController } from "./controllers"
import { AuthenticationService, Router, validations, uploads, findService } from "@repo/lib"

export class ServicesRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: ServicesSchemas,
		private controller: ServicesController,
	) {
		super({ prefix: "/api/dashboard/services" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
            middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL", "SENIOR","HELPER"])],
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
				validations.files({ required: false }),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN"]), validations.resourceId(findService)],
		})
	}
}
