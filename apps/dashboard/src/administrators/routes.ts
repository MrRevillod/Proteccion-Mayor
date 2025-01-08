import { AdministratorsSchemas } from "./schemas"
import { AdministratorsController } from "./controllers"
import { AuthenticationService, Router, validations, uploads, findAdministrator } from "@repo/lib"

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
			middlewares: [this.auth.authorize(["ADMIN"]), validations.body(this.schemas.create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				uploads.singleImage,
				this.auth.authorize(["ADMIN"]),
				validations.resourceId(findAdministrator),
				validations.body(this.schemas.update),
				validations.files({ required: false }),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [
				this.auth.authorize(["ADMIN"]),
				validations.resourceId(findAdministrator),
			],
		})

		this.post({
			path: "/confirm-action",
			handler: this.controller.confirmAction,
			middlewares: [this.auth.authorize(["ADMIN"])],
		})
	}
}
