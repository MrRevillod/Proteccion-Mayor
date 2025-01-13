import { ProfessionalsSchemas } from "./schemas"
import { ProfessionalsController } from "./controllers"
import { uploads, Router, validations } from "@repo/lib"
import { AuthenticationService, findProfessional } from "@repo/lib"

export class ProfessionalsRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: ProfessionalsSchemas,
		private controller: ProfessionalsController,
	) {
		super({ prefix: "/api/dashboard/professionals" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [this.auth.authorize(["ADMIN"])],
		})

		this.post({
			path: "/",
			handler: controller.createOne,
			middlewares: [this.auth.authorize(["ADMIN"]), validations.body(this.schemas.create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				uploads.singleImage,
				this.auth.authorize(["ADMIN", "PROFESSIONAL"]),
				validations.resourceId(findProfessional),
				validations.body(this.schemas.update),
				validations.files({ required: false }),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [
				this.auth.authorize(["ADMIN", "PROFESSIONAL"]),
				validations.resourceId(findProfessional),
			],
		})
	}
}
