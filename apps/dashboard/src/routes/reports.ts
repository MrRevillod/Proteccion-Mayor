import { Router } from "express"
import { generateGeneralReport } from "../controllers/reports"

const router: Router = Router()

router.get("/", generateGeneralReport)

export default router
