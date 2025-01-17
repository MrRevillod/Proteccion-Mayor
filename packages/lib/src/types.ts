import { ZodTypeAny } from "zod"
import { NextFunction, Request, Response } from "express"
import { Administrator, Professional, Senior } from "@prisma/client"

export type Controller = (req: Request, res: Response, handleError: NextFunction) => any
export type Middleware = (req: Request, res: Response, next: NextFunction) => any

export type SchemaBasedMiddleware = (schema: ZodTypeAny) => Middleware
export type RoleBasedMiddleware = (roles?: UserRole[]) => Middleware
export type FileMiddleware = ({ required }: FileMwOptions) => Middleware

type FileMwOptions = {
	required: boolean
}

export type ServiceName = "AUTH" | "DASHBOARD" | "STORAGE" | "WEB_APP"

export type ServiceInfo = {
	url: string
	port: number
}

export type User = Administrator | Senior | Professional
export type UserRole = "ADMIN" | "PROFESSIONAL" | "SENIOR"

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday"

export type DailyEvents = {
	centerId: number
	events: Array<{ start: string; end: string }>
}

export type WeeklyEvents = Record<WeekDay, DailyEvents>
