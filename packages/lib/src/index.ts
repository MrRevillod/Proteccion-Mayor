export { Router } from "./express/routing"
export { Module } from "./express/module"
export { Schema } from "./express/schema"
export { extensions } from "./express/extensions"
export { createApplication } from "./express/application"

export { errorHandler } from "./errors/handler"
export { AppError, AuthError, BadRequest, Conflict, Unauthorized, NotFound } from "./errors/custom"

export const log = (...args: unknown[]): void => {
	console.log("LOGGER: ", ...args)
}

export * as rules from "./rules"
export * as jwt from "./utils/jsonwebtoken"
export * as templates from "./utils/htmlTemplates"
export * as credentials from "./utils/credentials"

export { services, constants } from "./config"

export { MailerService } from "./services/mailer"
export { StorageService } from "./services/storage"
export { AuthenticationService } from "./services/authentication"

export type {
	JsonResponse,
	UserRole,
	User,
	ApiResponse,
	AuthResponse,
	FormattedDateCount,
	Controller,
} from "./types"

export { toPublicUser, findUser, isValidUserRole } from "./authorization/user"

export {
	signJsonwebtoken,
	verifyJsonwebtoken,
	AccessTokenOpts,
	CustomTokenOpts,
	RefreshTokenOpts,
	getServerTokens,
	type ServerTokens,
} from "./authorization/jsonwebtoken"
