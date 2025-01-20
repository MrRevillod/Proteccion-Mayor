import { staffController } from "../staff/controllers"
import { StaffSchemas } from "./schemas"
import { AuthenticationService, Router, validations, uploads, findStaff } from "@repo/lib"

export class StaffRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: StaffSchemas,
		private controller: staffController ,
	) {
		super({ prefix: "/api/dashboard/staff" })

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
				this.auth.authorize(["ADMIN","FUNCTIONARY"]),
				validations.resourceId(findStaff),
				validations.body(this.schemas.update),
				validations.files({ required: false }),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [
				this.auth.authorize(["ADMIN"]),
				validations.resourceId(findStaff),
			],
		})

		this.post({
			path: "/confirm-action",
			handler: this.controller.confirmAction,
			middlewares: [this.auth.authorize(["ADMIN","FUNCTIONARY"])],
		})
	}
}
