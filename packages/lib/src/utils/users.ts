import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { UserRole } from ".."

export const isValidRole = (role: string) => {
	return ["ADMIN", "SENIOR", "PROFESSIONAL"].includes(role)
}

// Función que busca un usuario en la base de datos según
// su rol y un filtro de busqueda

type FindUserArgs = {
	filter: any
	role: UserRole
}

export const find = async ({ role, filter }: FindUserArgs) => {
	const professionalSelect = {
		id: true,
		email: true,
		name: true,
		createdAt: true,
		updatedAt: true,
		serviceId: true,
		password: true,
		service: { select: { id: true, name: true, title: true } },
	}

	return await match(role)
		.with("ADMIN", () => {
			return prisma.administrator.findFirst({ where: filter })
		})
		.with("SENIOR", () => {
			return prisma.senior.findFirst({ where: filter })
		})
		.with("PROFESSIONAL", () => {
			return prisma.professional.findFirst({ where: filter, select: professionalSelect })
		})
		.run()
}
