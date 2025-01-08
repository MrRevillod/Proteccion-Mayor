import { HelpersSchemas } from "./schemas"
import { HelpersController } from "./controllers"
import { AuthenticationService, Router, validations, uploads, findAdministrator } from "@repo/lib"

export class HelpersRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: HelpersSchemas,
        private controller: HelpersController,
	) {
		super({ prefix: "/api/dashboard/helpers" })

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
