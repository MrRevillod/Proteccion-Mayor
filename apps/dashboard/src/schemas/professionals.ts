import { z } from "zod"
import { rules } from "@repo/lib"
import { parseSelectString } from "../utils/query"

const selectValues = ["id", "name", "serviceId"] as const

export const ProfessionalSchemas = {
	query: z.object({
		id: z.string().optional(),
		serviceId: z.number().optional(),
		limit: z.coerce.number().optional(),
		select: z
			.string()
			.optional()
			.transform((value) => parseSelectString(value, selectValues)),
	}),

	defaultSelect: {
		id: true,
		name: true,
		email: true,
		password: false,
		serviceId: true,
		updatedAt: true,
		createdAt: true,
		service: { select: { title: true } },
	},

	create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
		serviceId: z.number({ message: "La profesión es obligatoria" }),
	}),

	update: z
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
