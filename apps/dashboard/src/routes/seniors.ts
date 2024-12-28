import { Router } from "."
import { validateRole } from "../middlewares/authentication"
import { SeniorSchemas } from "../schemas/seniors"
import { filesValidation } from "../middlewares/file"
import { SeniorController } from "../controllers/seniors"
import { seniorsRegisterMobileImages, singleImageupload } from "../config"
import { userOwnerValidation, validateSchema, validateUserId } from "../middlewares/validation"

/**
 * Router de la entidad Senior
 * @class SeniorRouter
 * @extends {Router}
 * @param {SeniorController} controller Controlador de la entidad Senior
 */

export class SeniorRouter extends Router {
	constructor(private controller: SeniorController = new SeniorController()) {
		super()
		const { create, mobileRegister, update } = SeniorSchemas

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [validateRole(["ADMIN", "PROFESSIONAL"])],
		})

		this.post({
			path: "/pre-checked",
			handler: this.controller.createOne,
			middlewares: [validateRole(["ADMIN"]), validateSchema(create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [singleImageupload, validateUserId("SENIOR"), userOwnerValidation, validateSchema(update)],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [validateUserId("SENIOR"), userOwnerValidation],
		})

		this.post({
			path: "/new-mobile",
			handler: this.controller.createMobile,
			middlewares: [seniorsRegisterMobileImages, validateSchema(mobileRegister), filesValidation],
		})

		this.patch({
			path: "/:id/new",
			handler: this.controller.handleRegisterRequest,
			middlewares: [validateRole(["ADMIN"]), validateUserId("SENIOR")],
		})

		this.post({
			path: "/check-unique",
			handler: this.controller.checkUnique,
		})
	}
}
