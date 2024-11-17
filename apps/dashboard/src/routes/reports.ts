import { Router } from "express"
import { generateStatisticReport } from "../controllers/reports"
import { validateRole } from "../middlewares/authentication"

const router: Router = Router()

router.get("/", validateRole(["ADMIN", "PROFESSIONAL"]), generateStatisticReport)

export default router
