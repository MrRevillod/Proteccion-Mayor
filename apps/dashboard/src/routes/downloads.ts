import { Router } from "express"
import { downloadApk } from "../controllers/downloads"

const router: Router = Router()

router.get("/downloadapk", downloadApk)

export default router
