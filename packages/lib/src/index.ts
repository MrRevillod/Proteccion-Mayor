import { match } from "ts-pattern"

export const log = (...args: unknown[]): void => {
	console.log("LOGGER: ", ...args)
}

export const startService = (serviceName: string, url: string, port: number): void => {
	console.table({
		[serviceName]: {
			url,
			port,
		},
	})
}

export const dayToNumber = (day: string): number => {
	return match(day)
		.with("monday", () => 1)
		.with("tuesday", () => 2)
		.with("wednesday", () => 3)
		.with("thursday", () => 4)
		.with("friday", () => 5)
		.otherwise(() => 0)
}

export * as jwt from "./utils/jsonwebtoken"
export * as rules from "./utils/rules"
export * as users from "./utils/users"
export * as templates from "./utils/htmlTemplates"
export * as credentials from "./utils/credentials"
export * as validations from "./utils/validations"
export * as uploads from "./utils/uploads"

export {
	findAdministrator,
	findCenter,
	findEvent,
	findProfessional,
	findSenior,
	findService,
} from "./utils/actions"

export { MailerService } from "./services/mailer"
export { StorageService } from "./services/storage"
export { AuthenticationService } from "./services/authentication"

export type {
	UserRole,
	User,
	Controller,
	Middleware,
	DailyEvents,
	WeeklyEvents,
	WeekDay,
} from "./types"

export { Router } from "./application/routing"
export { Module } from "./application/module"
export { Schema } from "./application/schema"
export { extensions } from "./application/extensions"
export { errorHandler } from "./errors/handler"
export { createApplication } from "./application/"
export { CONSTANTS, SERVICES } from "./env"
export { AppError, AuthError, BadRequest, Conflict, Unauthorized, NotFound } from "./errors/custom"
