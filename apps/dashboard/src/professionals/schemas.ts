import { z } from "zod"
import { rules, Schema } from "@repo/lib"

export class ProfessionalsSchemas extends Schema {
	private readonly selectValues = ["id", "name", "serviceId"]

	get query() {
		return z.object({
			id: z.string().optional(),
			serviceId: z.number().optional(),
			limit: z.coerce.number().optional(),
			select: z
				.string()
				.optional()
				.transform((value) => this.parseSelect(value, this.selectValues)),
		})
	}

	get defaultSelect() {
		return {
			id: true,
			name: true,
			email: true,
			password: false,
			serviceId: true,
			updatedAt: true,
			createdAt: true,
			service: { select: { title: true, name: true } },
		}
	}

	get create() {
		return z.object({
			id: rules.rutSchema,
			name: rules.nameSchema,
			email: rules.emailSchema,
			serviceId: z.number({ message: "La profesión es obligatoria" }),
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
				path: ["confirmPassword"],
			})
	}
}
