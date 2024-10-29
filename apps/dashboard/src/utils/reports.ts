import { Prisma, Event } from "@prisma/client"
import { prisma } from "@repo/database"

const genFilter = (assistance: boolean): Prisma.EventWhereInput => {
	return { seniorId: { not: null }, assistance: { equals: assistance } }
}

export const getAssistanceCounter = async (assistance: boolean) => {
	const filter = genFilter(assistance)
	if (!assistance) filter.end = { lt: new Date().toISOString() } as Prisma.DateTimeFilter
	return await prisma.event.count({ where: filter })
}

export const getEventsByAssistance = async (assistance: boolean) => {
	const filter = genFilter(assistance)
	if (!assistance) filter.end = { lt: new Date().toISOString() } as Prisma.DateTimeFilter
	return await prisma.event.findMany({ where: filter, orderBy: { start: "asc" } })
}

export const reduceFunction = (acc: FormattedDateCount[], event: Event) => {
	const date = event.start.toISOString().split("T")[0]
	const index = acc.findIndex((item) => item.date === date)
	if (index === -1) {
		acc.push({ date, count: 1 })
	} else {
		acc[index].count++
	}
	return acc
}
