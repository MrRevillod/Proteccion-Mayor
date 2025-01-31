import dayjs from "dayjs"

import { Dayjs } from "dayjs"
import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { Event, Prisma } from "@prisma/client"
import { date } from "zod"
import { documents } from "@repo/lib"
import { eventReportDict, eventSplitedDict } from "./controllers"

type AssistanceVariants = "assistance" | "absence" | "unreserved"

export class ReportsService {
    public isValidReportType = (type: string) => {
        return ["general", "byCenter", "byService", "byProfessional"].includes(type)
    }

    private genMonthsArray = (year: number) => {
        return Array.from({ length: 12 }, (_, i) => dayjs().year(year).month(i).format("YYYY-MM"))
    }

    private getEventsWith = async (variant: AssistanceVariants, other?: Prisma.EventWhereInput) => {
        let filter: Prisma.EventWhereInput = { end: { lt: new Date().toISOString() } }

        match(variant)
            .with("assistance", () => {
                filter["seniorId"] = { not: null }
                filter["assistance"] = { equals: true }
            })
            .with("absence", () => {
                filter["seniorId"] = { not: null }
                filter["assistance"] = { equals: false }
            })
            .with("unreserved", () => {
                filter["seniorId"] = { equals: null }
            })
            .run()

        if (other) filter = { ...filter, ...other }

        return await prisma.event.findMany({
            where: filter,
            orderBy: { start: "asc" },
            include: { center: true, service: true },
        })
    }

    private getMonthlyEventCount = (events: Event[], month: string) => {
        return events
            .filter((event) => dayjs(event.start).format("YYYY-MM") === month)
            .reduce((count, _) => count + 1, 0)
    }

    private getBaseEvents = async (filter: Prisma.EventWhereInput) => {
        const assistance = this.getEventsWith("assistance", filter)
        const absence = this.getEventsWith("absence", filter)
        const unreserved = this.getEventsWith("unreserved", filter)

        return await Promise.all([assistance, absence, unreserved])
    }

    private makeFilter = (
        date: Dayjs,
        dateType: "year" | "month",
        other?: Prisma.EventWhereInput,
    ) => {
        return {
            start: { gte: date.startOf(dateType).toISOString() },
            end: { lt: date.endOf(dateType).toISOString() },
            ...other,
        }
    }

    public getGeneralReport = async (date: Dayjs, professionalId?: string) => {
        const professionalFilter = professionalId
            ? { professionalId: { equals: professionalId } }
            : undefined
        const [assistance, absence, unreserved] = await this.getBaseEvents(
            this.makeFilter(date, "year", professionalFilter),
        )
        const months = this.genMonthsArray(date.year())

        return months.map((month) => {
            return {
                month,
                assistances: this.getMonthlyEventCount(assistance, month),
                absences: this.getMonthlyEventCount(absence, month),
                unreserved: this.getMonthlyEventCount(unreserved, month),
            }
        })
    }

    public getByCenterReport = async (date: Dayjs) => {
        const centers = await prisma.center.findMany({ select: { name: true, id: true } })

        return await Promise.all(
            centers.map(async (center) => {
                const filter = this.makeFilter(date, "month", { centerId: center.id })
                const [assistance, absence, unreserved] = await this.getBaseEvents(filter)

                return {
                    center: center.name,
                    assistances: assistance.length,
                    absences: absence.length,
                    unreserved: unreserved.length,
                }
            }),
        )
    }

    public getRangeStats = async (from: Dayjs, to: Dayjs) => { }
    public getRangeEvents = async (from: Dayjs, to: Dayjs) => {
        return await prisma.event.findMany({
            where: {
                start: { gte: from.startOf("day").toISOString() },
                end: { lte: to.endOf("day").toISOString() },
            },
        })
    }

    public splitByCenter = async (events: documents.EventPrismaResult[]) => {

        const report: eventSplitedDict = {}

        const centers = await prisma.center.findMany({})
        for (const center of centers) {
            report[center.name] = {
                assistance: 0,
                absence: 0,
                unreserved: 0
            }
        }

        for (const event of events) {
            const center = event.center?.name

            if (center) {
                if (!report[center]) {
                    report[center] = {
                        assistance: 0,
                        absence: 0,
                        unreserved: 0
                    }
                }
                if (event.seniorId) {
                    if (event.assistance) {
                        report[center].assistance++
                    } else {
                        report[center].absence++
                    }
                } else {
                    report[center].unreserved++
                }
            }
        }
        return report
    }

    public splitByService = async (events: documents.EventPrismaResult[]) => {
        const report: eventSplitedDict = {}

        const services = await prisma.service.findMany({})
        for (const service of services) {
            report[service.name] = {
                assistance: 0,
                absence: 0,
                unreserved: 0
            }
        }

        for (const event of events) {
            const service = event.service?.name
            if (service) {
                if (!report[service]) {
                    report[service] = {
                        assistance: 0,
                        absence: 0,
                        unreserved: 0
                    }

                }
                if (event.seniorId) {
                    if (event.assistance) {
                        report[service].assistance++
                    } else {
                        report[service].absence++
                    }
                } else {
                    report[service].unreserved++
                }
            }
        }
        return report
    }

    public splitByProfessional = async (events: documents.EventPrismaResult[]) => {
        const report: eventSplitedDict = {}

        const professionals = await prisma.professional.findMany({})

        for (const professional of professionals) {
            report[professional.name] = {
                assistance: 0,
                absence: 0,
                unreserved: 0
            }
        }

        for (const event of events) {
            const professional = event.professional?.name
            if (professional) {
                if (!report[professional]) {
                    report[professional] = {
                        assistance: 0,
                        absence: 0,
                        unreserved: 0
                    }
                }
                if (event.seniorId) {
                    if (event.assistance) {
                        report[professional].assistance++
                    } else {
                        report[professional].absence++
                    }
                } else {
                    report[professional].unreserved++
                }
            }
        }
        return report
    }


    public allSelect = {
        assistance: true,
        start: true,
        seniorId: true,
        centerId: true,
        serviceId: true,
        professionalId: true,
        createdAt: true,
        end: true,
        updatedAt: true,
        center: {
            select: {
                name: true
            }
        },
        professional: {
            select: {
                name: true
            }
        },
        senior: {
            select: {
                name: true,
                rsh: true,
                birthDate: true,
                sector: {
                    select: {
                        name: true
                    }
                }
            }
        },
        service: {
            select: {
                name: true
            }
        }

    }
}
