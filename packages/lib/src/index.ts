import { NextFunction, Request, Response } from "express"

export const log = (...args: unknown[]): void => {
	console.log("LOGGER: ", ...args)
}

declare global {
	namespace Express {
		interface Request {
			extensions: Map<string, unknown>
			setExtension: (key: string, value: unknown) => void
			getExtension: (key: string) => unknown | undefined
		}
	}
}

export const extensions = (req: Request, res: Response, next: NextFunction) => {
	req.extensions = new Map<string, unknown>()

	req.setExtension = (key: string, value: unknown) => {
		req.extensions.set(key, value)
	}

	req.getExtension = (key: string) => {
		return req.extensions.get(key)
	}

	next()
}

export * as rules from "./validationRules"

export { httpRequest } from "./request"
export { services, constants } from "./config"
export type {
	JsonResponse,
	UserRole,
	User,
	ApiResponse,
	AuthResponse,
	FormattedDateCount,
	Controller,
} from "./types"
export { AppError, AuthError, errorHandler, BadRequest, Conflict } from "./errors"
export { toPublicUser, findUser, isValidUserRole } from "./authorization/user"
export { isValidRut } from "./authorization/rut"

export {
	SeniorSchemas,
	AdministratorSchemas,
	ProfessionalSchemas,
	EventSchemas,
	CentersSchemas,
} from "./schemas"

export {
	signJsonwebtoken,
	verifyJsonwebtoken,
	AccessTokenOpts,
	CustomTokenOpts,
	RefreshTokenOpts,
	getServerTokens,
	type ServerTokens,
} from "./authorization/jsonwebtoken"
