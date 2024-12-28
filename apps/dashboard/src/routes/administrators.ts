import { Router } from "."
import { validateRole } from "../middlewares/authentication"
import { singleImageupload } from "../config"
import { AdministratorSchemas } from "../schemas/administrators"
import { AdministratorController } from "../controllers/administrators"
import { validateSchema, validateUserId } from "../middlewares/validation"

/**
 * Router de la entidad Administrator
 * @class AdministratorRouter
 * @extends {Router} Router base
 * @param {AdministratorController}
 * controller Controlador de la entidad Administrator
 */

export class AdministratorRouter extends Router {
	private controller: AdministratorController

	constructor() {
		super()
		const { create, update } = AdministratorSchemas

		this.controller = new AdministratorController()

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [validateRole(["ADMIN"])],
		})

		this.post({
			path: "/",
			handler: this.controller.createOne,
			middlewares: [singleImageupload, validateRole(["ADMIN"]), validateSchema(create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [singleImageupload, validateRole(["ADMIN"]), validateUserId("ADMIN"), validateSchema(update)],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [validateRole(["ADMIN"]), validateUserId("ADMIN")],
		})

		this.post({
			path: "/confirm-action",
			handler: this.controller.confirmAction,
			middlewares: [validateRole(["ADMIN"])],
		})
	}
}
