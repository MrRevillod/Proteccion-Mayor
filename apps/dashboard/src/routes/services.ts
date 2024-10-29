import * as services from "../controllers/services"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { validateSchema } from "../middlewares/validation"
import { ServiceSchemas } from "@repo/lib"
import { singleImageupload } from "../config"

const { Create, Update } = ServiceSchemas

const router: Router = Router()

router.get("/", validateRole(["ADMIN", "PROFESSIONAL", "SENIOR"]), services.getAll)
router.post("/", validateRole(["ADMIN"]), singleImageupload, validateSchema(Create), services.create)

router.patch("/:id", validateRole(["ADMIN"]), singleImageupload, validateSchema(Update), services.updateById)
router.delete("/:id", validateRole(["ADMIN"]), services.deleteById)

export default router
