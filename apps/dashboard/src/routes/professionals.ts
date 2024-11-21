import * as professionals from "../controllers/professionals"

import { Router } from "express"
import { validateRole } from "../middlewares/authentication"
import { userOwnerValidation, validateSchema, validateUserId } from "../middlewares/validation"

import { singleImageupload } from "../config"
import { ProfessionalSchemas } from "@repo/lib"

const { Create, Update } = ProfessionalSchemas

const router: Router = Router()

// -- Endpoints CRUD

// Obtener todos los profesionales -- Requiere rol de administrador
router.get("/", validateRole(["ADMIN"]), professionals.getAll)
router.get("/unique", validateRole(["ADMIN"]), professionals.getOneById)

// Crear un profesional -- Requiere rol de administrador
router.post("/", validateSchema(Create), validateRole(["ADMIN"]), professionals.create)

// Actualizar un profesional por id -- Requiere middleware de pertenencia
router.patch("/:id", singleImageupload, validateUserId("PROFESSIONAL"), userOwnerValidation, validateSchema(Update), professionals.updateById)

// Eliminar un profesional por id -- Reqiere middleware de pertenencia
router.delete("/:id", validateUserId("PROFESSIONAL"), userOwnerValidation, professionals.deleteById)

export default router
