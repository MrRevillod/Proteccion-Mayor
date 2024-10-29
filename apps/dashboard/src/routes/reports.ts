import { Router } from "express"
import { generateGeneralReport } from "../controllers/reports"

const router: Router = Router()

router.get("/", generateGeneralReport)

//router.get("/concurrencia/centros", getConcurrenceByCenters)
//router.get("/concurrencia/servicios", getConcurrenceByService)
export default router
