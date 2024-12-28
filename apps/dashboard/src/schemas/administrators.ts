import { z } from "zod"
import { rules } from "@repo/lib"

export const AdministratorSchemas = {
	defaultSelect: {
		id: true,
		name: true,
		email: true,
		createdAt: true,
		updatedAt: true,
	},

	create: z.object({
		id: rules.rutSchema,
		name: rules.nameSchema,
		email: rules.emailSchema,
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
