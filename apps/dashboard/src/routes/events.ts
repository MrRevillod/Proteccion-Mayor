import * as events from "../controllers/events"

import { Router } from "express"
import { EventSchemas } from "@repo/lib"
import { validateRole } from "../middlewares/authentication"
import { validateSchema } from "../middlewares/validation"

const { Create, Update } = EventSchemas

const router: Router = Router()

router.get("/", validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]), events.getAll) //getAll
router.post("/", validateSchema(Create), events.create) //newEvent
router.patch("/:id", validateSchema(Update), events.updateById) //updateEvent
router.patch("/:id/reservate", validateRole(["SENIOR"]), events.reserveEvent)
router.patch("/:id/cancel", events.cancelReserve)

router.delete("/:id", events.deleteById) //updateEvent

router.get("/:serviceId", validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]), events.getByService)

export default router
