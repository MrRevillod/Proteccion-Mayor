import { Router } from "."
import { validateRole } from "../middlewares/authentication"
import { validateSchema } from "../middlewares/validation"
import { CentersSchemas } from "../schemas/centers"
import { CenterController } from "../controllers/centers"
import { singleImageupload } from "../config"

/**
 * Router de la entidad Center
 * @class CenterRouter
 * @extends {Router} Router base
 * @param {CenterController} controller Controlador de la entidad Center
 */

export class CenterRouter extends Router {
	private controller: CenterController

	constructor() {
		super()
		const { create, update } = CentersSchemas

		this.controller = new CenterController()

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [validateRole(["ADMIN", "PROFESSIONAL"])],
		})

		this.post({
			path: "/",
			handler: this.controller.createOne,
			middlewares: [singleImageupload, validateRole(["ADMIN"]), validateSchema(create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [singleImageupload, validateRole(["ADMIN"]), validateSchema(update)],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [validateRole(["ADMIN"])],
		})
	}
}
