import { z } from "zod"
import { Prisma } from "@prisma/client"
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

	get defaultSelect(): Prisma.SeniorSelect {
		return {
			id: true,
			name: true,
			email: true,
			phone: true,
			rsh: true,
			address: true,
			birthDate: true,
			validated: true,
			password: false,
			createdAt: true,
			updatedAt: true,
			gender: true,
			registeredBy: true,
			sectorId: true,
			registeredByStaff: {
				select: {
					id: true,
					name: true,
					center: {
						select: {
							name: true,
						},
					},
				},
			},
			sector: {
				select: {
					id: true,
					name: true,
				},
			},
		}
	}

	get mobileRegister() {
		return z.object({
			rut: rules.rutSchema,
			email: rules.emailSchema,
			pin: rules.pinSchema,
			phone: rules.phoneSchema,
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
			phone: rules.phoneSchema,
			rsh: rules.rshSchema,
			sectorId: z.coerce.number(),
		})
	}

	get update() {
		return z
			.object({
				name: rules.nameSchema,
				address: rules.addressSchema,
				email: z.string().email().optional(),
				birthDate: rules.dateTimeSchema,
				password: rules.optionalPinSchema,
				confirmPassword: rules.optionalPinSchema,
				phone: rules.phoneSchema.optional(),
				rsh: rules.rshSchema.optional(),
				sectorId: z.coerce.number().optional(),
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Los PIN ingresados no coinciden",
			})
	}

	get handleRegisterRequest() {
		return z.optional(
			z
				.object({
					rut: rules.rutSchema.optional(),
					name: rules.nameSchema.optional(),
					email: rules.emailSchema.optional(),
					address: rules.addressSchema.optional(),
					birthDate: z.string({ message: "La fecha de nacimiento es requerida" }).optional(),
					gender: rules.genderSchema.optional(),
					rsh: rules.rshSchema.optional(),
					sectorId: z.coerce.number().optional(),
				})
				.refine((data) => !data.birthDate || rules.isValidDate(data.birthDate), {
					message: "La fecha de ingresada no es válida",
					path: ["birthDate"],
				})
				.refine((data) => !data.birthDate || rules.isValidSeniorBirthDate(data.birthDate), {
					message: "La fecha de nacimiento no corresponde a la de una persona mayor",
					path: ["birthDate"],
				}),
		)
	}
}

export type CreateBody = z.infer<typeof SeniorSchemas.prototype.create>
export type UpdateBody = z.infer<typeof SeniorSchemas.prototype.update>
