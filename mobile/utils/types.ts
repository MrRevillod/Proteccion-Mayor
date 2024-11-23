import { Control, FieldValues } from "react-hook-form"

export type commonProps = {
	route: any
	navigation: any
	control?: Control<FieldValues>
	errors?: any
	handleSubmit?: any
	setValue?: any
	getValues?: any
	trigger?: any
	setError?: any
	validateAndNavigate?: any
	rutSenior?: string | null
}

export type Senior = {
	id: string
	name: string
	email: string
	address: string
	birthDate: string
	validated: boolean
	createdAt: string
	updatedAt: string
}

export interface User extends Senior {
	service: Partial<Senior>
}

export type AuthResponse = {
	role: "Senior"
	user: User
}

export type loginSeniorFormData = {
	email: string
	password: string
}
