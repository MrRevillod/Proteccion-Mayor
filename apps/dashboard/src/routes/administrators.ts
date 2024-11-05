import * as administrators from "../controllers/administrators"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { singleImageupload } from "../config"
import { AdministratorSchemas } from "@repo/lib"
import { validateSchema, validateUserId } from "../middlewares/validation"

const { Create, Update } = AdministratorSchemas

const router: Router = Router()

// -- Endpoints CRUD

// Obtener todos los administradores --- Requiere rol de administrador
router.get("/", validateRole(["ADMIN"]), administrators.getAll)

// Crear un administrador  --- Requiere rol de administrador
router.post("/", validateRole(["ADMIN"]), validateSchema(Create), administrators.create)

// Actualizar un administrador por id --- Requiere rol de administrador
router.patch("/:id", singleImageupload, validateUserId("ADMIN"), validateRole(["ADMIN"]), validateSchema(Update), administrators.updateById)

// Eliminar un administrador por id --- Requiere rol de administrador
router.delete("/:id", validateUserId("ADMIN"), validateRole(["ADMIN"]), administrators.deleteById)

router.post("/confirm-action", validateRole(["ADMIN"]), administrators.confirmAction)

export default router
