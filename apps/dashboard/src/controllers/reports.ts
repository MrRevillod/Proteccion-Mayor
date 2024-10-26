import { NextFunction, Request, Response } from "express"
import { prisma } from "@repo/database"

export const datos = async (asistencia: boolean) => {
	const eventos = await prisma.event.findMany({
		select: {
			startsAt: true,
			assistance: true,
			id: true,
		},
		where: {
			AND: [{ endsAt: { lte: new Date() } }, { seniorId: { not: null } }, { assistance: asistencia }],
		},
		orderBy: {
			startsAt: "asc",
		},
	})
	const conteoPorFecha: { [key: string]: number } = {}

	eventos.forEach((evento) => {
		const fecha = evento.startsAt.toISOString().split("T")[0]
		if (conteoPorFecha[fecha]) {
			conteoPorFecha[fecha]++
		} else {
			conteoPorFecha[fecha] = 1
		}
	})

	// Convertir el objeto en un arreglo para enviarlo
	const resultado = Object.keys(conteoPorFecha).map((fecha) => ({
		date: fecha,
		count: conteoPorFecha[fecha],
	}))

	return resultado
}
export const getConcurrenceForTieme = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let [asistencia, inasistencia] = await Promise.all([datos(true), datos(false)])
		res.status(200).json({ values: { asistencia, inasistencia } })
	} catch (error: unknown) {
		next(error)
	}
}

/* export const getConcurrenceByCenters = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const concurrencia = await prisma.event.groupBy({
			by: ["centerId", "assistance"],
			_count: {
				id: true,
			},
			orderBy: {
				centerId: "asc",
			},
		})

		const reportData = await Promise.all(
			concurrencia.map(async (evento) => {
				let centerName = "Centro desconocido"

				if (evento.centerId !== null) {
					const center = await prisma.center.findUnique({
						where: { id: evento.centerId },
					})
					centerName = center?.name || centerName
				}

				return {
					centerName,
					assistance: evento.assistance,
					count: evento._count.id,
				}
			}),
		)

		res.json(reportData)
	} catch (error) {
		next(error)
	}
}

export const getConcurrenceByService = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const concurrencia = await prisma.event.groupBy({
			by: ["serviceId", "assistance"],
			_count: {
				id: true,
			},
			orderBy: {
				serviceId: "asc",
			},
		})

		const reportData = await Promise.all(
			concurrencia.map(async (evento) => {
				let serviceName = "Centro desconocido"

				if (evento.serviceId !== null) {
					const service = await prisma.service.findUnique({
						where: { id: evento.serviceId },
					})
					serviceName = service?.name || serviceName
				}

				return {
					serviceName,
					assistance: evento.assistance,
					count: evento._count.id,
				}
			}),
		)

		res.json(reportData)
	} catch (error) {
		next(error)
	}
}
 */
