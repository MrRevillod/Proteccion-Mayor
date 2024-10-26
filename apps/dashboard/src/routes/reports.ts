import { Router } from "express"
import { getConcurrenceForTieme } from "../controllers/reports"

const router: Router = Router()

router.get("/concurrencia", getConcurrenceForTieme)

//router.get("/concurrencia/centros", getConcurrenceByCenters)
//router.get("/concurrencia/servicios", getConcurrenceByService)
export default router
