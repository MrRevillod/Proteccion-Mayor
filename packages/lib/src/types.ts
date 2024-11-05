import { Administrator, Professional, Senior } from "@prisma/client"

export type ContentTypeVariant = "JSON" | "MULTIPART"
export type AllowedHttpMethod = "POST" | "PUT" | "DELETE" | "GET" | "PATCH"
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
