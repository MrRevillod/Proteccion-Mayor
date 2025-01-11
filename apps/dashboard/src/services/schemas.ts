import { z } from "zod"
import { Prisma } from "@prisma/client"
import { rules, Schema } from "@repo/lib"

export class ServicesSchemas extends Schema {
	private readonly selectValues = ["id", "name", "title"]

	get query() {
		return z.object({
			select: z
				.string()
				.optional()
				.transform((value) => this.parseSelect(value, this.selectValues)),
		})
	}

	get defaultSelect(): Prisma.ServiceSelect {
		return {
			id: true,
			name: true,
			title: true,
			description: true,
			color: true,
			minutesPerAttention: true,
		}
	}

	get create() {
		return z.object({
			name: rules.nameServiceSchema,
			title: rules.titleServiceSchema,
			description: rules.descriptionSchema,
			color: rules.colorSchema,
			minutesPerAttention: z.number().int().positive(),
		})
	}

	get update() {
		return z.object({
			name: rules.nameServiceSchema,
			title: rules.titleServiceSchema,
			description: rules.descriptionSchema,
			color: rules.colorSchema,
			minutesPerAttention: z.number().int().positive(),
		})
	}
}
