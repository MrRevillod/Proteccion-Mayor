import { Prisma } from "@prisma/client"
import { rules, Schema } from "@repo/lib"
import { z } from "zod"

export class OperativesSchemas extends Schema {
	query: any
	get defaultSelect(): Prisma.OperativesSelect {
		return {
			id: true,
			name: true,
			description: true,
			start: true,
			end: true,
			professionals: true,
			services: true,
			centers: true,
			centerId: true,
		}
	}

	get create() {
		return z.object({
			name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
			description: z.string(),
			start: rules.dateTimeSchema,
			end: rules.dateTimeSchema,
			centerId: z.coerce.number({ message: "El centro es obligatorio" }),
			services: z.array(z.coerce.number()),
			professionals: z.array(z.string()),
		})
	}

	get update() {
		return z.object({
			name: z.string().min(2).optional(),
			description: z.string().optional(),
			start: rules.dateTimeSchema,
			end: rules.dateTimeSchema,
			centerId: z.coerce.number(),
			services: z.array(z.coerce.number()),
			professionals: z.array(z.string()),
		})
	}
}
