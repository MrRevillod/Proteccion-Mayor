import { z } from "zod"
import { rules, Schema } from "@repo/lib"

export class SeniorSchemas extends Schema {
	private readonly selectOptions = ["id", "name"]

	get query() {
		return z.object({
			id: z.string().optional(),
			name: z.string().optional(),
			email: z.string().optional(),
			validated: z.enum(["0", "1"]).optional(),
			limit: z.coerce.number().optional(),
			select: z
				.string()
				.optional()
				.transform((value) => this.parseSelect(value, this.selectOptions)),
		})
	}

	get defaultSelect() {
		return {
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
	}

	get mobileRegister() {
		return z.object({
			rut: rules.rutSchema,
			email: rules.emailSchema,
			pin: rules.pinSchema,
		})
	}

	get create() {
		return z.object({
			id: rules.rutSchema,
			email: rules.emailSchema,
			name: rules.nameSchema,
			address: rules.addressSchema,
			birthDate: rules.dateTimeSchema,
			gender: rules.genderSchema,
		})
	}

	get update() {
		return z
			.object({
				name: rules.nameSchema,
				address: rules.addressSchema,
				birthDate: rules.dateTimeSchema,
				password: rules.optionalPinSchema,
				confirmPassword: rules.optionalPinSchema,
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Los PIN ingresados no coinciden",
			})
	}

	get handleRegisterRequest() {
		return z
			.object({
				rut: rules.rutSchema.optional(),
				name: rules.nameSchema.optional(),
				email: rules.emailSchema.optional(),
				address: rules.addressSchema.optional(),
				birthDate: z.string({ message: "La fecha de nacimiento es requerida" }).optional(),
				gender: rules.genderSchema.optional(),
			})
			.refine((data) => data.birthDate && rules.isValidDate(data.birthDate), {
				message: "La fecha de ingresada no es válida",
				path: ["birthDate"],
			})
			.refine((data) => data.birthDate && rules.isValidSeniorBirthDate(data.birthDate), {
				message: "La fecha de nacimiento no corresponde a la de una persona mayor",
				path: ["birthDate"],
			})
	}
}
