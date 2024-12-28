import { Router } from "."
import { validateRole } from "../middlewares/authentication"
import { validateSchema } from "../middlewares/validation"
import { ServiceSchemas } from "../schemas/services"
import { ServiceController } from "../controllers/services"
import { singleImageupload } from "../config"

/**
 * Router de la entidad Service
 * @class ServiceRouter
 * @extends {Router} Router base
 * @param {ServiceController} controller Controlador de la entidad Service
 */

export class ServiceRouter extends Router {
	private controller: ServiceController

	constructor() {
		super()
		const { create, update } = ServiceSchemas

		this.controller = new ServiceController()

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"])],
		})

		this.post({
			path: "/:id",
			handler: this.controller.createOne,
			middlewares: [validateRole(["ADMIN"]), singleImageupload, validateSchema(create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [validateRole(["ADMIN"]), singleImageupload, validateSchema(update)],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [validateRole(["ADMIN"])],
		})
	}
}
