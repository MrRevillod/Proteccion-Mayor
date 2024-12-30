import { Administrator, Professional, Senior } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

export type Controller = (req: Request, res: Response, handleError: NextFunction) => any
export type Middleware = (req: Request, res: Response, next: NextFunction) => any

export type RoleBasedMiddleware = (roles?: UserRole[]) => Middleware

export type ServiceName = "AUTH" | "DASHBOARD" | "STORAGE" | "WEB_APP"

export type ServiceInfo = {
	url: string
	port: number
}

export type JsonResponse<T> = {
	status?: number
	message: string
	type: "success" | "error"
	values: T
}

type Dict = Record<string, any>

export type ApiResponse = JsonResponse<Dict>
export type AuthResponse = {
	role: UserRole
	user: User
}

export type User = Administrator | Senior | Professional
export type UserRole = "ADMIN" | "PROFESSIONAL" | "SENIOR"

export type FormattedDateCount = {
	date: string
	count: number
}
