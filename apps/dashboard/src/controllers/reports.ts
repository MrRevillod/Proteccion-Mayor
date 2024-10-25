import { NextFunction, Request, Response } from "express"
import { prisma } from "@repo/database"

export const getConcurrenceForTieme = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const concurrencia = await prisma.event.groupBy({
			by: ["startsAt", "assistance"],
			_count: {
				id: true,
			},
			orderBy: {
				startsAt: "asc",
			},
		})

		const reportData = concurrencia.map((evento) => ({
			date: evento.startsAt.toISOString().split("T")[0],
			assistance: evento.assistance,
			count: evento._count.id,
		}))

		res.json(reportData)
	} catch (error: unknown) {
		next(error)
	}
}
