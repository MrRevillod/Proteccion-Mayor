import dayjs from "dayjs"

import { match } from "ts-pattern"
import { ReportsService } from "./service"
import { AppError, Controller } from "@repo/lib"

export class ReportsController {
	constructor(private service: ReportsService) {}

	public generateStatisticReport: Controller = async (req, res, next) => {
		try {
			const dateQuery = req.query.date as string
			const reportType = req.query.type as string
			const professionalId = req.query.professionalId as string

			if (!this.service.isValidReportType(reportType as string)) {
				throw new AppError(400, "Invalid report type")
			}

			if (reportType === "byProfessional" && !professionalId) {
				return res.json({ values: { report: new Array() } })
			}

			const date = match(reportType)
				.with("byCenter", () => dayjs(dateQuery))
				.with("byService", () => dayjs(dateQuery))

				.with("byProfessional", () => dayjs().year(Number(dateQuery)))
				.with("general", () => dayjs().year(Number(dateQuery)))
				.run()

			const data = await match(reportType)
				.with("byCenter", async () => await this.service.getByCenterReport(date))
				.with("byService", async () => await this.service.getByServiceReport(date))
				.with(
					"byProfessional",
					async () => await this.service.getGeneralReport(date, professionalId),
				)
				.with("general", async () => await this.service.getGeneralReport(date))
				.run()

			res.json({ values: { report: data } })
		} catch (error) {
			next(error)
		}
	}
}
