import { z } from "zod"
import { rules, Schema } from "@repo/lib"

export class AdministratorsSchemas extends Schema {
	get defaultSelect() {
		return {
			id: true,
			name: true,
			email: true,
			createdAt: true,
			updatedAt: true,
		}
	}

	get create() {
		return z.object({
			id: rules.rutSchema,
			name: rules.nameSchema,
			email: rules.emailSchema,
		})
	}

	get update() {
		return z
			.object({
				name: rules.nameSchema,
				email: rules.emailSchema,
				password: rules.optionalPasswordSchema,
				confirmPassword: rules.optionalPasswordSchema,
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Las contraseñas ingresadas no coinciden",
			})
	}
}
