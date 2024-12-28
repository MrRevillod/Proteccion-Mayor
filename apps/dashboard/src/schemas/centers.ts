import { z } from "zod"
import { rules } from "@repo/lib"
import { parseSelectString } from "../utils/query"

const selectOptions = ["id", "name"] as const

export const CentersSchemas = {
	/**
	 * Query schema for the getMany method
	 * @/controllers/centers.ts - getMany method
	 */

	query: z.object({
		select: z
			.string()
			.optional()
			.transform((value) => parseSelectString(value, selectOptions)),
	}),

	/**
	 * Default schema for prisma select options
	 * @type {Record<string, boolean>}
	 */

	defaultSelect: {
		id: true,
		name: true,
		address: true,
		phone: true,
		color: true,
	},

	/**
	 * Schema for the create method
	 * @/controllers/centers.ts - createOne method
	 */

	create: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
		color: rules.colorSchema,
	}),

	/**
	 * Schema for the update method
	 * @/controllers/centers.ts - updateOne method
	 */

	update: z.object({
		name: rules.nameCenterSchema,
		address: rules.addressCenterSchema,
		phone: rules.phoneSchema,
		color: rules.colorSchema,
	}),
}
