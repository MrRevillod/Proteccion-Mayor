import { z } from "zod"
import * as rules from "./validationRules"

export const SeniorSchemas = {
	MobileRegister: z.object({
		rut: rules.rutSchema,
		email: rules.emailSchema,
		pin: rules.pinSchema,
	}),

	DashboardRegister: z.object({
		id: rules.rutSchema,
		email: rules.emailSchema,
		name: rules.nameSchema,
		address: rules.addressSchema,
		birthDate: rules.dateTimeSchema,
		gender: rules.genderSchema,
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			address: rules.addressSchema,
			birthDate: rules.dateTimeSchema,
			password: rules.optionalPinSchema,
			confirmPassword: rules.optionalPinSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Los PIN ingresados no coinciden",
			path: ["confirmPassword"],
		}),
}

export const ServiceSchemas = {
	Create: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		color: rules.colorSchema,
	}),
	Update: z.object({
		name: rules.nameServiceSchema,
		title: rules.titleServiceSchema,
		description: rules.descriptionSchema,
		color: rules.colorSchema,
	}),
}

export const CentersSchemas = {
	Create: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
	}),
	Update: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
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
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		}),
}

export const EventSchemas = {
	Create: z.object({
		start: rules.dateTimeSchema,
		end: rules.dateTimeSchema,
		professionalId: rules.rutSchema,
		serviceId: z.number({ message: "El servicio es obligatorio" }),
		seniorId: z.optional(rules.rutSchema),
		centerId: z.number({ message: "El centro es obligatorio" }),
	}),
	Update: z
		.object({
			start: rules.dateTimeSchema,
			end: rules.dateTimeSchema,
			professionalId: rules.rutSchema,
			serviceId: z.number(),
			assistance: z.boolean(),
			seniorId: z.optional(rules.rutSchema),
			centerId: z.number(),
		})
		.refine((data) => data.start < data.end, {
			message: "La fecha de inicio no puede ser mayor a la fecha de finalización",
			path: ["start", "end"],
		}),
}

export const ProfessionalSchemas = {
	Create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
		serviceId: z.number({ message: "La profesión es obligatoria" }),
	}),

	Update: z
		.object({
			name: rules.nameSchema,
			email: rules.emailSchema,
			password: rules.optionalPasswordSchema,
			confirmPassword: rules.optionalPasswordSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Las contraseñas ingresadas no coinciden",
			path: ["confirmPassword"],
		}),
}
