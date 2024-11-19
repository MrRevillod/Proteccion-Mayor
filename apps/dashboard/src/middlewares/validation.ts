import { prisma } from "@repo/database"
import { Request, Response, NextFunction } from "express"
import { AnyZodObject, SomeZodObject, ZodEffects, ZodObject } from "zod"
import { AppError, findUser, getServerTokens, httpRequest, User, UserRole, AuthResponse } from "@repo/lib"

// Middleware de validación de ID de usuario
// Valida si el ID de usuario en la URL de la petición es válido (existe en la base de datos)
export const validateUserId = (role: UserRole) => async (req: Request, res: Response, next: NextFunction) => {
	if (!req.params.id) throw new AppError(400, "Petición inválida")

	try {
		const user = await findUser({ id: req.params.id }, role)
		if (!user) throw new AppError(400, "El usuario solicitado no existe")

		// La extensión "user" se utiliza en los controladores para
		// acceder al usuario que se está modificando o consultando

		req.setExtension("requestedUser", user)

		next()
	} catch (error) {
		next(error)
	}
}

// Middleware de validación de campos en formularios
// Valida si los campos en el cuerpo de la petición son válidos
// según el rol del usuario y el tipo de formulario (fichero lib/schemas.ts)
export const validateSchema = (schema: SomeZodObject | ZodEffects<ZodObject<any, any>> | AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body)
			next()
		} catch (error: any) {
			console.error(error.message)
			next(new AppError(400, "Error de validación de campos en el formulario"))
		}
	}
}

// se obtienen los tokens, se realiza una request al AUTH para validar la sesion,
// esta devuelve tanto el user como el rol, si es ADMIN se permite el acceso, sino
// se compara el id del usuario en la sesion con el id del usuario en la URL
export const userOwnerValidation = async (req: Request, res: Response, next: NextFunction) => {
	const tokens = getServerTokens(req.headers, req.cookies)

	try {
		const response = await httpRequest<AuthResponse>({
			service: "AUTH",
			endpoint: "/validate-auth",
			headers: {
				Authorization: `Bearer ${tokens?.access || null}`,
			},
		})

		if (response.type === "error") {
			throw new AppError(response.status || 500, response.message)
		}

		const responseRole = response.values.role
		const responseUserId = response.values.user.id

		const requestedUser = req.getExtension("requestedUser") as User | undefined

		if (!requestedUser) {
			throw new AppError(400, "El usuario solicitado no existe")
		}

		if (responseRole === "ADMIN") return next()

		if (responseUserId !== requestedUser.id) {
			throw new AppError(401, "No tienes permisos para acceder a este recurso")
		}

		next()
	} catch (error) {
		next(error)
	}
}

// Para el evento es parecido al anterior pero aca se busca la id del evento y luego se compara
// si las claves foraneas del profesional o del senior son iguales a la id del usuario en la sesion
export const eventOwnerValidation = async (req: Request, res: Response, next: NextFunction) => {
	const tokens = getServerTokens(req.headers, req.cookies)
	if (!req.params.id) throw new AppError(400, "Petición inválida")
	const eventId = req.params.id

	try {
		const event = await prisma.event.findUnique({
			where: {
				id: Number(eventId),
			},
		})

		if (!event) {
			throw new AppError(400, "El evento solicitado no existe")
		}

		const response = await httpRequest<AuthResponse>({
			service: "AUTH",
			endpoint: "/validate-auth",
			headers: {
				Authorization: `Bearer ${tokens?.access || null}`,
			},
		})

		if (response.type === "error") {
			throw new AppError(response.status || 500, response.message)
		}

		const responseRole = response.values.role
		const responseUserId = response.values.user.id

		if (responseRole === "ADMIN") {
			return next()
		}

		if (!event || (event.professionalId !== responseUserId && event.seniorId !== responseUserId)) {
			throw new AppError(401, "No tienes permisos para acceder a este recurso")
		}
		next()
	} catch (error) {
		next(error)
	}
}
