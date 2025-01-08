import { z } from "zod"
import * as rules from "./validationRules"
import dayjs from "dayjs"

export const LoginFormSchema = z.object({
	email: z.string().email().min(1, "El correo electrónico es requerido"),
	password: z.string().min(1, "La contraseña es requerida"),
	role: z.enum(["ADMIN", "PROFESSIONAL","HELPER"]),
})

export const SeniorSchemas = {
	MobileRegister: z.object({
		rut: rules.rutSchema,
		email: rules.emailSchema,
		pin: rules.pinSchema,
	}),

	DashboardRegister: z
		.object({
			id: rules.rutSchema,
			email: rules.emailSchema,
			name: rules.nameSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }),
			gender: rules.genderSchema,
		})
		.refine((data) => rules.isValidDate(data.birthDate), {
			message: "La fecha de ingresada no es válida",
			path: ["birthDate"],
		})
		.refine((data) => rules.isSeniorBirthDate(data.birthDate), {
			message: "La fecha de nacimiento no es válida",
			path: ["birthDate"],
		}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			address: rules.addressSchema,
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }),
			password: rules.optionalPinSchema,
			confirmPassword: rules.optionalPinSchema,
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
			birthDate: z.string({ message: "La fecha de nacimiento es requerida" }),
			gender: rules.genderSchema,
		})
		.refine((data) => rules.isValidDate(data.birthDate), {
			message: "La fecha de ingresada no es válida",
			path: ["birthDate"],
		})
		.refine((data) => rules.isSeniorBirthDate(data.birthDate), {
			message: "La fecha de nacimiento no corresponde a la de una persona mayor",
			path: ["birthDate"],
		})
		.refine((data) => rules.isValidRut(data.rut), {
			message: "El RUT ingresado no es válido",
			path: ["rut"],
		}),
}

export const AdministratorSchemas = {
	Create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			password: rules.optionalPasswordSchema,
			confirmPassword: rules.optionalPasswordSchema,
			image: rules.imageSchemaUpdate,
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
		serviceId: z.number({ message: "La profesión es requerida" }),
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			password: rules.optionalPasswordSchema,
			confirmPassword: rules.optionalPasswordSchema,
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
}

export const EventSchemas = {
	Create: z
		.object({
			start: z.string({ message: "La fecha de inicio es requerida" }),
			end: z.string({ message: "La fecha de término es requerida" }),
			professionalId: z.string({ message: "El profesional es requerido" }),
			serviceId: z.number({ message: "El servicio es requerido" }),
			seniorId: z.optional(rules.rutSchema),
			centerId: z.number({ message: "El centro es requerido" }),
			repeat: z.optional(z.enum(["daily", "weekly"])),
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
		.refine((data) => rules.isWeekend(data.start) && rules.isWeekend(data.end), {
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
			}
		),
	Update: z
		.object({
			start: z.string({ message: "La fecha de inicio es requerida" }),
			end: z.string({ message: "La fecha de término es requerida" }),
			professionalId: rules.rutSchema,
			serviceId: z.number(),
			assistance: z.boolean(),
			seniorId: z.optional(rules.rutSchema),
			centerId: z.number(),
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
		.refine((data) => rules.isWeekend(data.start) && rules.isWeekend(data.end), {
			message: "No es posible crear eventos los fin de semana",
			path: ["end", "start"],
		}),
}

export const resetPasswordSchema = (role: "ADMIN" | "PROFESSIONAL" | "SENIOR"|"HELPER"): any => {
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
