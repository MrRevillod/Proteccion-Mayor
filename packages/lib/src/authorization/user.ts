import { match } from "ts-pattern"
import { prisma } from "@repo/database"
import { User, UserRole } from ".."

export const toPublicUser = (user: User): Partial<User> => {
	if (!user.password) return user
	const { password, ...userData } = user
	return userData
}

// Función que valida si un rol es válido

export const isValidUserRole = (role: string): role is UserRole => {
	return ["ADMIN", "PROFESSIONAL", "SENIOR"].includes(role)
}

// Función que busca un usuario en la base de datos según
// su rol y un filtro de busqueda

export const findUser = async (filter: any, role: UserRole) => {
	return await match(role)
		.with("ADMIN", async () => {
			return await prisma.administrator.findFirst({ where: filter })
		})
		.with("SENIOR", async () => {
			return await prisma.senior.findFirst({ where: filter })
		})
		.with("PROFESSIONAL", async () => {
			return await prisma.professional.findFirst({
				where: filter,
				select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
					serviceId: true,
					password: true,
					service: {
						select: {
							id: true,
							name: true,
							title: true,
						},
					},
				},
			})
		})
		.run()
}
