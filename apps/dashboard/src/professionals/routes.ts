import { Router } from "@repo/lib"
import { singleImageupload } from "../config"
import { ProfessionalsSchemas } from "./schemas"
import { ProfessionalsController } from "./controllers"
import { AuthenticationService } from "@repo/lib"
import { validateSchema, validateUserId } from "../middlewares/validation"

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
			middlewares: [this.auth.authorize(["ADMIN"]), validateSchema(this.schemas.create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				singleImageupload,
				this.auth.authorize(["ADMIN"]),
				validateUserId("PROFESSIONAL"),
				validateSchema(this.schemas.update),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [
				this.auth.authorize(["ADMIN", "PROFESSIONAL"]),
				validateUserId("PROFESSIONAL"),
			],
		})
	}
}
