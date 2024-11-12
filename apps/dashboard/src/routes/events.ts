import * as events from "../controllers/events"

import { Router } from "express"
import { EventSchemas } from "@repo/lib"
import { validateRole } from "../middlewares/authentication"
import { validateSchema } from "../middlewares/validation"

const { Create, Update } = EventSchemas

const router: Router = Router()

// Endpoints CRUD

router.get("/", validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]), events.getAll)
router.post("/", validateRole(["ADMIN", "PROFESSIONAL"]), validateSchema(Create), events.create)
router.patch("/:id", validateRole(["ADMIN", "PROFESSIONAL"]), validateSchema(Update), events.updateById)
router.delete("/:id", validateRole(["ADMIN", "PROFESSIONAL"]), events.deleteById)

// Endpoints adicionales

router.patch("/:id/reservate", validateRole(["SENIOR"]), events.reserveEvent)
router.patch("/:id/cancel", validateRole(["SENIOR"]), events.cancelReserve)

router.get("/:serviceId", validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]), events.getByService)
router.get("/:serviceId/:centerId", validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]), events.getByServiceCenter)

export default router
