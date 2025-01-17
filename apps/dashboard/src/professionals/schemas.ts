import { z } from "zod"
import { rules, Schema } from "@repo/lib"
import { Prisma } from "@prisma/client"

export class ProfessionalsSchemas extends Schema {
	private readonly selectValues = ["id", "name", "serviceId"]

	get query() {
		return z.object({
			id: z.string().optional(),
			serviceId: z.coerce.number().optional(),
			limit: z.coerce.number().optional(),
			select: z
				.string()
				.optional()
				.transform((value) => this.parseSelect(value, this.selectValues)),
		})
	}

	get defaultSelect(): Prisma.ProfessionalSelect {
		return {
			id: true,
			name: true,
			email: true,
			password: false,
			serviceId: true,
			updatedAt: true,
			createdAt: true,
			minutesPerSession: true,
			service: { select: { title: true, name: true } },
		}
	}

	get create() {
		return z.object({
			id: rules.rutSchema,
			name: rules.nameSchema,
			email: rules.emailSchema,
			serviceId: z.number({ message: "La profesión es obligatoria" }),
			minutesPerSession: rules.minutesPerSessionSchema,
		})
	}

	get update() {
		return z
			.object({
				name: rules.nameSchema,
				email: rules.emailSchema,
				password: rules.optionalPasswordSchema,
				confirmPassword: rules.optionalPasswordSchema,
				minutesPerSession: rules.minutesPerSessionSchema,
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Las contraseñas ingresadas no coinciden",
				path: ["confirmPassword"],
			})
	}
}
