import { z } from "zod"
import { Prisma } from "@prisma/client"
import { rules, Schema } from "@repo/lib"

export class StaffSchemas extends Schema {
	get defaultSelect(): Prisma.StaffSelect {
		return {
			id: true,
			name: true,
			email: true,
			centerId: true,
			role: true,
			createdAt: true,
			updatedAt: true,
			center: {
				select: {
					name: true,
				},
			},
		}
	}

	get create() {
		return z
			.object({
				id: rules.rutSchema,
				name: rules.nameSchema,
				email: rules.emailSchema,
				role: rules.staffRoleSchema,
				centerId: z.coerce.number().optional(),
			})
			.refine(
				(data) => {
					if (data.role === "ADMIN") {
						return data.centerId === undefined
					}
					if (data.role === "FUNCTIONARY") {
						return data.centerId !== undefined
					}
					return true
				},
				{
					message: "El centro es obligatorio para FUNCTIONARY y debe estar vacío para ADMIN",
					path: ["centerId"],
				},
			)
	}

	get update() {
		return z
			.object({
				name: rules.nameSchema,
				email: rules.emailSchema,
				centerId: z.coerce.number().optional(),
				role: rules.staffRoleSchema,
				password: rules.optionalPasswordSchema,
				confirmPassword: rules.optionalPasswordSchema,
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Las contraseñas ingresadas no coinciden",
			})
	}
}
