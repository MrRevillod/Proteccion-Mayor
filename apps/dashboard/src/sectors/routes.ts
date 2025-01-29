import { SectorSchemas } from "./schemas"
import { SectorsController } from "./controllers"
import { AuthenticationService, findSector, Router, validations } from "@repo/lib"

export class SectorsRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: SectorSchemas,
		private controller: SectorsController,
	) {
		super({ prefix: "/api/dashboard/sectors" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [this.auth.authorize(["ADMIN", "FUNCTIONARY"])],
		})

		this.post({
			path: "/",
			handler: this.controller.createOne,
			middlewares: [
				this.auth.authorize(["ADMIN", "FUNCTIONARY"]),
				validations.body(this.schemas.create),
				validations.resourceId(findSector),
			],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				this.auth.authorize(["ADMIN", "FUNCTIONARY"]),
				validations.resourceId(findSector),
				validations.body(this.schemas.update),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN", "FUNCTIONARY"]), validations.resourceId(findSector)],
		})
	}
}
