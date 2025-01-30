import dayjs from "dayjs"
import * as rules from "./validationRules"

import { z } from "zod"

export const LoginFormSchema = z.object({
	email: z.string().email().min(1, "El correo electrónico es requerido"),
	password: z.string().min(1, "La contraseña es requerida"),
	role: z.enum(["ADMIN", "PROFESSIONAL", "FUNCTIONARY"]),
})

export const SeniorSchemas = {
	DashboardRegister: z
		.object({
			id: rules.rutSchema,
			email: rules.emailSchema,
			name: rules.nameSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }).refine(rules.isSeniorBirthDate, {
				message: "La fecha de nacimiento no corresponde a la de una persona mayor",
			}),
			gender: rules.genderSchema,
			phone: rules.phoneSchema,
			rsh: rules.rshSchema,
			sectorId: z.coerce.number(),
		})
		.refine((data) => rules.isValidDate(data.birthDate), {
			message: "La fecha de ingresada no es válida",
			path: ["birthDate"],
		}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }),
			phone: rules.phoneSchema,
			password: rules.optionalPinSchema,
			confirmPassword: rules.optionalPinSchema,
			rsh: z.coerce
				.number({ message: "Se espera un número" })
				.min(0, { message: "El valor mínimo es 0" })
				.max(100, { message: "El valor máximo es 100" })
				.optional(),
			sectorId: z.coerce.number().optional(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Los PIN ingresados no coinciden",
			path: ["confirmPassword"],
		})
		.refine((data) => rules.isValidDate(data.birthDate), {
			message: "La fecha de ingresada no es válida",
			path: ["birthDate"],
		}),

	Validate: z
		.object({
			rut: z.string({ message: "El RUT es requerido" }),
			name: rules.nameSchema,
			email: rules.emailSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }).refine(rules.isSeniorBirthDate, {
				message: "La fecha de nacimiento no corresponde a la de una persona mayor",
			}),
			gender: rules.genderSchema,
			rsh: rules.rshSchema,
			sectorId: z.coerce.number({ message: "El sector es requerido" }),
		})
		.refine((data) => rules.isValidRut(data.rut), {
			message: "El RUT ingresado no es válido",
			path: ["rut"],
		}),
}

export const StaffSchemas = {
	Create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
		role: rules.staffRoleSchema,
		centerId: z.coerce.number(),
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			password: rules.optionalPasswordSchema,
			confirmPassword: rules.optionalPasswordSchema,
			image: rules.imageSchemaUpdate,
			role: rules.staffRoleSchema,
			centerId: z.coerce.number(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		}),
}

export const ProfessionalSchemas = {
	Create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
		minutesPerSession: rules.minutesPerSessionSchema,
		serviceId: z.number({ message: "La profesión es requerida" }),
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			password: rules.optionalPasswordSchema,
			confirmPassword: rules.optionalPasswordSchema,
			minutesPerSession: rules.minutesPerSessionSchema,
			image: rules.imageSchemaUpdate,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		}),
}

export const ServiceSchemas = {
	Create: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		image: rules.imageSchemaCreate,
		color: rules.colorSchema,
	}),
	Update: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		image: rules.imageSchemaUpdate,
		color: rules.colorSchema,
	}),
}

export const CentersSchemas = {
	Create: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
		image: rules.imageSchemaCreate,
		color: rules.colorSchema,
	}),
	Update: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
		image: rules.imageSchemaUpdate,
		color: rules.colorSchema,
	}),

	UpdateDailySessions: z.object({
		servicesDailyAttentions: z.array(
			z.object({
				id: z.string(),
				quantity: z.coerce.number().int().min(1),
				serviceId: z.string(),
				centerId: z.string(),
			}),
		),
	}),
}
export const OperativeSchemas = {
	Create: z.object({
		name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
		description: z.string(),
		start: z.string({ message: "La fecha de inicio es requerida" }),
		end: z.string({ message: "La fecha de término es requerida" }),
		centerId: z.coerce.number({ message: "El centro es obligatorio" }),
		services: z.array(z.coerce.number()),
		professionals: z.array(z.string()),
		image: rules.imageSchemaCreate,
	}),
	Update: z.object({
		name: z.string().min(2).optional(),
		description: z.string().optional(),
		start: z.string({ message: "La fecha de inicio es requerida" }),
		end: z.string({ message: "La fecha de término es requerida" }),
		centerId: z.coerce.number(),
		services: z.array(z.coerce.number()),
		professionals: z.array(z.string()),
		image: rules.imageSchemaUpdate,
	}),
}

export const EventSchemas = {
	Create: z
		.object({
			start: z.string({ message: "La fecha de inicio es requerida" }),
			end: z.string({ message: "La fecha de término es requerida" }),
			professionalId: z.string({ message: "El profesional es requerido" }),
			serviceId: z.number({ message: "El servicio es requerido" }),
			seniorId: z.optional(rules.rutSchema),
			centerId: z.coerce.number({ message: "El centro es requerido" }),
		})
		.refine((data) => data.start < data.end, {
			message: "Rango de tiempo invalido",
			path: ["end", "start"],
		})
		.refine((data) => rules.isValidRut(data.professionalId), {
			message: "El campo no es válido",
			path: ["professionalId"],
		})
		.refine((data) => rules.isValidDate(data.start), {
			message: "La fecha de ingresada no es válida",
			path: ["start"],
		})
		.refine((data) => rules.isValidDate(data.end), {
			message: "La fecha de ingresada no es válida",
			path: ["end"],
		})
		.refine((data) => !rules.isWeekend(data.start) && !rules.isWeekend(data.end), {
			message: "No es posible crear eventos los fin de semana",
			path: ["end", "start"],
		})
		.refine(
			(data) => {
				const start = dayjs(data.start)
				const end = dayjs(data.end)
				return end.diff(start, "hours") <= 5
			},
			{
				message: "La duración máxima de un evento es de 5 horas",
			},
		),

	Update: z
		.object({
			start: z.string({ message: "La fecha de inicio es requerida" }),
			end: z.string({ message: "La fecha de término es requerida" }),
			professionalId: rules.rutSchema,
			serviceId: z.number(),
			assistance: z.boolean(),
			seniorId: z.optional(rules.rutSchema),
			centerId: z.coerce.number(),
		})
		.refine((data) => data.start < data.end, {
			path: ["end", "start"],
			message: "Rango de tiempo invalido",
		})
		.refine((data) => rules.isValidRut(data.professionalId), {
			message: "El campo no es válido",
			path: ["professionalId"],
		})
		.refine((data) => rules.isValidDate(data.start), {
			message: "La fecha de ingresada no es válida",
			path: ["start"],
		})
		.refine((data) => rules.isValidDate(data.end), {
			message: "La fecha de ingresada no es válida",
			path: ["end"],
		})
		.refine((data) => !rules.isWeekend(data.start) && !rules.isWeekend(data.end), {
			message: "No es posible crear eventos los fin de semana",
			path: ["end", "start"],
		}),
}

export const resetPasswordSchema = (role: "ADMIN" | "PROFESSIONAL" | "SENIOR" | "FUNCTIONARY" | "STAFF"): any => {
	return z
		.object({
			password: role === "SENIOR" ? rules.pinSchema : rules.passwordSchema,
			confirmPassword: role === "SENIOR" ? rules.pinSchema : rules.passwordSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		})
}

export const statisticsSchemas = {
    General: z.object({
        from: z.string(),
        to: z.string(),
        centerId: z.optional(rules.centerIdSchema),
        professionalId: z.optional(rules.rutSchema),
        serviceId: z.optional(z.number()),
    }),
}