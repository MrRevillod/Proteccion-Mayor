import { Router } from "express"
import { compareLinkToken, requestPasswordReset, resetPassword } from "../controllers/account"

const router: Router = Router()

router.post("/reset-password", requestPasswordReset)
router.post("/reset-password/:id/:token/:role", resetPassword)
router.get("/reset-password/:id/:token/:role", compareLinkToken)

export default router
