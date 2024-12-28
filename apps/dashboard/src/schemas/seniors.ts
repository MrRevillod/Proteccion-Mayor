import { z } from "zod"
import { rules } from "@repo/lib"
import { parseSelectString } from "../utils/query"

const selectOptions = ["id", "name"] as const

export const SeniorSchemas = {
	/**
	 * Schema for the getMany method
	 * @/controllers/seniors.ts - getMany method
	 */

	query: z.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		validated: z.enum(["0", "1"]).optional(),
		limit: z.coerce.number().optional(),
		select: z
			.string()
			.optional()
			.transform((value) => parseSelectString(value, selectOptions)),
	}),

	/**
	 * Default schema for prisma select options
	 * @type {Record<string, boolean>}
	 */

	defaultSelect: {
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
	},

	/**
	 * Schema for the createMobile method
	 * @/controllers/seniors.ts - createOne method
	 */

	mobileRegister: z.object({
		rut: rules.rutSchema,
		email: rules.emailSchema,
		pin: rules.pinSchema,
	}),

	/**
	 * Schema for the create method
	 * @/controllers/seniors.ts - createOne
	 */

	create: z.object({
		id: rules.rutSchema,
		email: rules.emailSchema,
		name: rules.nameSchema,
		address: rules.addressSchema,
		birthDate: rules.dateTimeSchema,
		gender: rules.genderSchema,
	}),

	/**
	 * Schema for the update method
	 * @/controllers/seniors.ts - updateOne
	 */

	update: z
		.object({
			name: rules.nameSchema,
			address: rules.addressSchema,
			birthDate: rules.dateTimeSchema,
			password: rules.optionalPinSchema,
			confirmPassword: rules.optionalPinSchema,
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Los PIN ingresados no coinciden",
		}),
}
