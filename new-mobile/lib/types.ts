import { z } from "zod"
import { AxiosResponse } from "axios"
import { RegisterSchema } from "./schemas"

export type RegisterFormData = z.infer<typeof RegisterSchema>

export type HexColor = `#${string}`
export type Nullable<T> = T | null

interface User {
	id: string
	email: string
	name: string
	createdAt: string
	updatedAt: string
	address: string
	birthDate: string
	validated: boolean
}

export type Service = {
	id: number
	name: string
	title: string
	description: string
	color: HexColor
}

export type Center = {
	id: number
	name: string
	address: string
	phone: string
}

export type ApiResponse = {
	status?: number
	message: string
	type: "success" | "error"
	values: any
}

export type ApiError = string | string[] | null

export type QueryAction = ({ params, query }: QueryActionProps) => Promise<AxiosResponse<any, any>>
export type MutateAction = ({ id, body }: MutateActionProps) => Promise<AxiosResponse<any, any>>

export interface QueryActionProps {
	params?: Record<string, any>
	query?: string
}

export interface MutateActionProps {
	id?: string | number
	body?: any
}

export type MutationResponse<T> = {
	modified: T
	image?: string
}
