import { Router } from "."
import { validateRole } from "../middlewares/authentication"
import { singleImageupload } from "../config"
import { ProfessionalSchemas } from "../schemas/professionals"
import { ProfessionalController } from "../controllers/professionals"
import { userOwnerValidation, validateSchema, validateUserId } from "../middlewares/validation"

/**
 * Router de la entidad Professional
 * @class ProfessionalRouter
 * @extends {Router} Router base
 * @param {ProfessionalController}
 * controller Controlador de la entidad Professional
 */

export class ProfessionalRouter extends Router {
	private professionals: ProfessionalController

	constructor() {
		super()
		const { create, update } = ProfessionalSchemas

		this.professionals = new ProfessionalController()

		this.get({
			path: "/",
			handler: this.professionals.getMany,
			middlewares: [validateRole(["ADMIN"])],
		})

		this.post({
			path: "/",
			handler: this.professionals.createOne,
			middlewares: [singleImageupload, validateRole(["ADMIN"]), validateSchema(create)],
		})

		this.patch({
			path: "/:id",
			handler: this.professionals.updateOne,
			middlewares: [singleImageupload, validateUserId("PROFESSIONAL"), userOwnerValidation, validateSchema(update)],
		})

		this.delete({
			path: "/:id",
			handler: this.professionals.deleteOne,
			middlewares: [validateUserId("PROFESSIONAL"), userOwnerValidation],
		})
	}
}
