import { z } from "zod"
import { Prisma } from "@prisma/client"
import { rules, Schema } from "@repo/lib"

export type ServiceSchemas = typeof ServicesSchemas

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
		}
	}

	get create() {
		return z.object({
			name: rules.nameServiceSchema,
			title: rules.titleServiceSchema,
			description: rules.descriptionSchema,
			color: rules.colorSchema,
		})
	}

	get update() {
		return z.object({
			name: rules.nameServiceSchema,
			title: rules.titleServiceSchema,
			description: rules.descriptionSchema,
			color: rules.colorSchema,
		})
	}
}
