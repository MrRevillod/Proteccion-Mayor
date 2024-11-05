import { FormattedDateCount } from "@repo/lib"
import { NextFunction, Request, Response } from "express"
import { getAssistanceCounter, getEventsByAssistance, reduceFunction } from "../utils/reports"

export const generateGeneralReport = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const assistanceEvents = await getEventsByAssistance(true)
		const formattedAssistanceEvents = [] as FormattedDateCount[]

		assistanceEvents.reduce((acc, event) => {
			return reduceFunction(acc, event)
		}, formattedAssistanceEvents)

		const noAssistanceEvents = await getEventsByAssistance(false)
		const formattedNoAssistanceEvents = [] as FormattedDateCount[]

		const totalAssistanceCount = await getAssistanceCounter(true)
		const totalNoAssistanceCount = await getAssistanceCounter(false)

		noAssistanceEvents.reduce((acc, event) => {
			return reduceFunction(acc, event)
		}, formattedNoAssistanceEvents)

		return res.status(200).json({
			values: {
				formattedAssistanceEvents,
				formattedNoAssistanceEvents,
				totalAssistanceCount,
				totalNoAssistanceCount,
			},
		})
	} catch (error) {
		next(error)
	}
}
