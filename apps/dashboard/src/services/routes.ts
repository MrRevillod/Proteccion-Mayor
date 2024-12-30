import { validateSchema } from "../middlewares/validation"
import { ServicesSchemas } from "./schemas"
import { singleImageupload } from "../config"
import { ServicesController } from "./controllers"
import { AuthenticationService, Router } from "@repo/lib"

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
			middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL", "SENIOR"])],
		})

		this.post({
			path: "/:id",
			handler: this.controller.createOne,
			middlewares: [
				singleImageupload,
				this.auth.authorize(["ADMIN"]),
				validateSchema(this.schemas.create),
			],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				singleImageupload,
				this.auth.authorize(["ADMIN"]),
				validateSchema(this.schemas.update),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN"])],
		})
	}
}
