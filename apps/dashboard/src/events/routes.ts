import { Router } from "@repo/lib"
import { EventsSchemas } from "./schemas"
import { validateSchema } from "../middlewares/validation"
import { EventsController } from "./controllers"
import { AuthenticationService } from "@repo/lib"

export class EventsRouter extends Router {
	constructor(
		private auth: AuthenticationService,
		private schemas: EventsSchemas,
		private controller: EventsController,
	) {
		super({ prefix: "/api/dashboard/events" })

		this.get({
			path: "/",
			handler: this.controller.getMany,
			middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL", "SENIOR"])],
		})

		this.post({
			path: "/",
			handler: this.controller.createOne,
			middlewares: [
				this.auth.authorize(["ADMIN", "PROFESSIONAL"]),
				validateSchema(this.schemas.create),
			],
		})

		this.patch({
			path: "/:id",
			handler: this.controller.updateOne,
			middlewares: [
				this.auth.authorize(["ADMIN", "PROFESSIONAL"]),
				validateSchema(this.schemas.update),
			],
		})

		this.delete({
			path: "/:id",
			handler: this.controller.deleteOne,
			middlewares: [this.auth.authorize(["ADMIN", "PROFESSIONAL"])],
		})

		this.patch({
			path: "/:id/reservate",
			handler: this.controller.createReservation,
			middlewares: [this.auth.authorize(["SENIOR"])],
		})

		this.patch({
			path: "/:id/cancel",
			handler: this.controller.cancelReservation,
			middlewares: [this.auth.authorize(["SENIOR"])],
		})

		this.get({
			path: "/available-dates",
			handler: controller.getAvailableDates,
			middlewares: [this.auth.authorize(["SENIOR"])],
		})

		this.get({
			path: "/by-date",
			handler: this.controller.getEventsByDate,
			middlewares: [this.auth.authorize(["SENIOR"])],
		})

		this.get({
			path: "/available-centers/:serviceId",
			handler: this.controller.getCentersByService,
			middlewares: [this.auth.authorize(["SENIOR"])],
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
