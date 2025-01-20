import { z } from "zod"
import { Prisma } from "@prisma/client"
import { rules, Schema } from "@repo/lib"

export class EventsSchemas extends Schema {
	get query() {
		return z.object({
			professionalId: z.string().optional(),
			centerId: z.coerce.number().optional(),
			seniorId: z.string().optional(),
			serviceId: z.coerce.number().optional(),
			start: z.string().optional(),
			end: z.string().optional(),
		})
	}

	get defaultSelect(): Prisma.EventSelect {
		return {
			id: true,
			start: true,
			end: true,
			assistance: true,
			seniorId: true,
			professionalId: true,
			serviceId: true,
			centerId: true,
			createdAt: true,
			updatedAt: true,
			service: {
				select: { id: true, name: true, color: true },
			},
			center: {
				select: { id: true, name: true, address: true },
			},
			senior: {
				select: { id: true, name: true, email: true },
			},
			professional: { select: { name: true, email: true } },
		}
	}

	get create() {
		return z
			.object({
				start: rules.dateTimeSchema,
				end: rules.dateTimeSchema,
				professionalId: rules.rutSchema,
				serviceId: z.number({ message: "El servicio es obligatorio" }),
				seniorId: z.optional(rules.rutSchema),
				centerId: z.number({ message: "El centro es obligatorio" }),
			})
			.refine((data) => rules.isWeekend(data.start) && rules.isWeekend(data.end), {
				message: "No es posible crear eventos los fin de semana",
				path: ["end", "start"],
			})
	}

	get createMany() {
		return z
			.object({
				start: rules.dateTimeSchema,
				end: rules.dateTimeSchema,
				weeklyEvents: rules.weeklyEventsSchema,
			})
			.refine((data) => rules.isWeekend(data.start) && rules.isWeekend(data.end), {
				message: "No es posible crear eventos los fin de semana",
			})
	}

	get update() {
		return z
			.object({
				start: rules.dateTimeSchema,
				end: rules.dateTimeSchema,
				professionalId: rules.rutSchema,
				serviceId: z.number(),
				assistance: z.boolean(),
				seniorId: z.optional(rules.rutSchema),
				centerId: z.number(),
			})
			.refine((data) => data.start < data.end, {
				message: "La fecha de inicio no puede ser mayor a la fecha de finalización",
				path: ["start", "end"],
			})

			.refine((data) => rules.isWeekend(data.start) && rules.isWeekend(data.end), {
				message: "No es posible crear eventos los fin de semana",
				path: ["end", "start"],
			})
	}
}

export type EventQuery = z.infer<typeof EventsSchemas.prototype.query>
export type WeeklyEvents = z.infer<typeof EventsSchemas.prototype.createMany>
