import { Router } from "express"
import { arrayController, deleteController } from "./controllers"
import { uploadFields } from "./multer"

export const router: Router = Router()

router.post("/:id", uploadFields, arrayController)
router.delete("/:id", deleteController)
