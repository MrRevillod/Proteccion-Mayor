import { Router } from "express"
import { validateFields } from "./middlewares/validations"
import { logoutController } from "./controllers/logout"
import { refreshController, validateSession } from "./controllers/validate"
import { loginController, loginSeniorMobile } from "./controllers/login"
import { authenticationByRole, sessionMiddleware } from "./middlewares/authentication"

const router: Router = Router()

// -- Rutas de autenticación

// Iniciar sesión (Variantes ADMIN y PROFESSIONAL)
// Uso: POST /auth/login?variant=ADMIN | PROFESSIONAL
router.post("/login", validateFields("LOGIN_FIELDS"), loginController)

// Iniciar sesión (Variante SENIOR)
router.post("/login-senior", validateFields("SENIOR_LOGIN_FIELDS"), loginSeniorMobile)

// Refrescar token de acceso
router.get("/refresh", refreshController)

// Cerrar sesión
router.post("/logout", sessionMiddleware, logoutController)

// -- Rutas de validación de sesión

// Validar sesión -> Retorna OK si la sesión es válida
router.get("/validate-auth", sessionMiddleware, validateSession)

// Validar rol de usuario (ADMIN, PROFESSIONAL, SENIOR)
router.get("/validate-role/:role", sessionMiddleware, authenticationByRole, validateSession)

router.get("/health", (req, res) => {
	res.status(200).send("OK")
})

export default router
