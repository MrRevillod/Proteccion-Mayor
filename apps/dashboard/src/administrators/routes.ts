import { singleImageupload } from "../config"
import { AdministratorsSchemas } from "./schemas"
import { AdministratorsController } from "./controllers"
import { AuthenticationService, Router } from "@repo/lib"
import { validateSchema, validateUserId } from "../middlewares/validation"

export class AdministratorsRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: AdministratorsSchemas,
		private controller: AdministratorsController,
	) {
		super({ prefix: "/api/dashboard/administrators" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [this.auth.authorize(["ADMIN"])],
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
				validateUserId("ADMIN"),
				validateSchema(this.schemas.update),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN"]), validateUserId("ADMIN")],
		})

		this.post({
			path: "/confirm-action",
			handler: this.controller.confirmAction,
			middlewares: [this.auth.authorize(["ADMIN"])],
		})
	}
}
