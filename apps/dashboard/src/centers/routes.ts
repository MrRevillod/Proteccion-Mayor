import { Router } from "@repo/lib"
import { validateSchema } from "../middlewares/validation"
import { CentersSchemas } from "./schemas"
import { CentersController } from "./controllers"
import { singleImageupload } from "../config"
import { AuthenticationService } from "@repo/lib"

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
