import { z } from "zod"
import { Schema } from "@repo/lib"
import { Prisma } from "@prisma/client"

export class SectorSchemas extends Schema {
	private readonly selectValues = ["id", "name"]

	get query() {
		return z.object({
			select: z
				.string()
				.optional()
				.transform((value) => this.parseSelect(value, this.selectValues)),
		})
	}

	get defaultSelect(): Prisma.SectorSelect {
		return {
			id: true,
			name: true,
			createdAt: true,
			updatedAt: true,
		}
	}

	get create() {
		return z.object({
			name: z.string().min(3).max(255),
		})
	}

	get update() {
		return z.object({
			name: z.string().min(3).max(255).optional(),
		})
	}
}
