import { ZodTypeAny } from "zod"
import { NextFunction, Request, Response } from "express"
import {  Professional, Senior, Staff } from "@prisma/client"

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

export type User =  Senior | Professional | Staff
export type UserRole = "ADMIN" | "PROFESSIONAL" | "SENIOR" | "FUNCTIONARY" | "STAFF"
export type StaffRole = "ADMIN" | "FUNCTIONARY" 