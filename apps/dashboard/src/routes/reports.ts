import { Router } from "express"
import { getConcurrenceForTieme } from "../controllers/reports"

const router: Router = Router()

router.get("/concurrencia", getConcurrenceForTieme)

export default router
