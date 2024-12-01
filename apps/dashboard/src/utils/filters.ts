import { Prisma } from "@prisma/client"

// Interface base para representar un query
interface Query {}

// type para representar un Record con las keys de una query
// y los valores de los filtros por cada entidad (por eso es generico T)
export type QueryMap<T> = { [K in keyof T]: (value: any) => any }

// Funcion para generar un where a partir de un query y un queryMap
// El Where es un objeto especial que se usa en prisma para filtrar.
export const generateWhere = <T extends Query>(query: T, queryMap: QueryMap<T>, logicCondition = "OR") => {
	const conditions = [] as any[]

	Object.keys(query).forEach((key) => {
		const value = query[key as keyof T]
		if (value === "") return
		if (queryMap[key as keyof T]) {
			const filter = queryMap[key as keyof T](query[key as keyof T])
			if (filter !== null) conditions.push({ [key]: filter })
		}
	})

	return conditions.length ? { [logicCondition]: conditions } : {}
}

export const generateSelect = <T extends Query>(query: string | undefined, select: T) => {
	const querySelect = {} as T // Se crea un objeto vacio del tipo T

	// El formatod de una query select es una cadena de texto separada por comas
	// ejemplo: ?select=name,email

	// Entonces separamos por comas y se itera sobre cada campo
	// serteando el campo en el objeto querySelect a true
	if (query) {
		query.split(",").forEach((field) => {
			querySelect[field as keyof T] = true as T[keyof T]
		})
	}

	// Si no se envía un query select se retornan los campos por defecto
	return Object.keys(querySelect).length ? querySelect : select
}

// --- Filtro y Query para la entidad Evento ---

export interface EventQuery extends Query {
	professionalId?: string
	serviceId?: string
	centerId?: string
	seniorId?: string
}

export const eventSelect: Prisma.EventSelect = {
	id: true,
	start: true,
	end: true,
	assistance: true,
	seniorId: true,
	professionalId: true,
	serviceId: true,
	centerId: true,
	service: {
		select: { name: true, color: true },
	},
	center: {
		select: { id: true, name: true },
	},
	senior: {
		select: { id: true, name: true, email: true },
	},
	professional: { select: { name: true, email: true } },
	createdAt: true,
	updatedAt: true,
}

// --- Filtro y Query para la entidad Profesional ---

export interface ProfessionalQuery extends Query {
	id?: string
	serviceId?: string
	select?: string
}

export const professionalSelect: Prisma.ProfessionalSelect = {
	id: true,
	name: true,
	email: true,
	password: false,
	serviceId: true,
	updatedAt: true,
	createdAt: true,
	service: { select: { title: true } },
}

// --- Filtro y Query para la entidad Servicio ---
export interface ServiceQuery extends Query {
	centerId?: string
	select?: string
}

export const serviceSelect: Prisma.ServiceSelect = {
	id: true,
	name: true,
	title: true,
	description: true,
	color: true,
}

// --- Filtro y Query para la entidad Centro ---

export interface CenterQuery extends Query {
	select?: string
}

export const centerSelect: Prisma.CenterSelect = {
	id: true,
	name: true,
	address: true,
	phone: true,
}

// --- Filtro y Query para la entidad Senior ---

export interface SeniorQuery extends Query {
	select?: string
}

export const seniorSelect: Prisma.SeniorSelect = {
	id: true,
	name: true,
	email: true,
	address: true,
	birthDate: true,
	validated: true,
	password: false,
	createdAt: true,
	updatedAt: true,
	gender: true,
}
