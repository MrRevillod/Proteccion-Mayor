import { EventController } from "../controllers/events"

import { Router } from "."
import { EventSchemas } from "../schemas/events"
import { validateRole } from "../middlewares/authentication"
import { validateSchema } from "../middlewares/validation"

export class EventRouter extends Router {
	private controller: EventController

	constructor() {
		super()
		const { create, update } = EventSchemas

		this.controller = new EventController()

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"])],
		})

		this.post({
			path: "/",
			handler: this.controller.createOne,
			middlewares: [validateRole(["ADMIN", "PROFESSIONAL"]), validateSchema(create)],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [validateRole(["ADMIN", "PROFESSIONAL"]), validateSchema(update)],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [validateRole(["ADMIN", "PROFESSIONAL"])],
		})

		this.patch({
			path: "/:id/reservate",
			handler: this.controller.createReservation,
			middlewares: [validateRole(["SENIOR"])],
		})

		this.patch({
			path: "/:id/cancel",
			handler: this.controller.cancelReservation,
			middlewares: [validateRole(["SENIOR"])],
		})

		this.get({
			path: "/available-dates",
			handler: this.controller.getAvailableDates,
			middlewares: [validateRole(["SENIOR"])],
		})

		this.get({
			path: "/by-date",
			handler: this.controller.getEventsByDate,
			middlewares: [validateRole(["SENIOR"])],
		})
	}
}

// router.get(
// 	"/:serviceId",
// 	validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]),
// 	events.getCentersByService,
// )

// router.get(
// 	"/:serviceId/:centerId",
// 	validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]),
// 	events.getByServiceCenter,
// )

// export default router
