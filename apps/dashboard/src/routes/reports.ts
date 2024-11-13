import { Router } from "express"
import { generateStatisticReport } from "../controllers/reports"

const router: Router = Router()

router.get("/", generateStatisticReport)

export default router
