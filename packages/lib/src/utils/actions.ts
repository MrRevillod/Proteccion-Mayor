import { prisma } from "@repo/database"

export const findProfessional = (id: string) => {
	return prisma.professional.findFirst({ where: { id } })
}

export const findFunctionary = (id: string) => {
	return prisma.staff.findFirst({ where: { id, role:"FUNCTIONARY" } })
}

export const findSenior = (id: string) => {
	return prisma.senior.findFirst({ where: { id } })
}

export const findAdministrator = (id: string) => {
	return prisma.staff.findFirst({ where: { id, role:"ADMIN" } })
}

export const findService = (id: string) => {
	return prisma.service.findFirst({ where: { id: Number(id) } })
}

export const findCenter = (id: string) => {
	return prisma.center.findFirst({ where: { id: Number(id) } })
}

export const findEvent = (id: string) => {
	return prisma.event.findFirst({ where: { id: Number(id) } })
}

export const findStaff = (id: string) => {
    return prisma.staff.findFirst({ where: { id } })
}
