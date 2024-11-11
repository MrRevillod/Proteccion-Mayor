const { hash } = require("bcrypt")
const { faker } = require("@faker-js/faker")
const { readFileSync } = require("node:fs")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const Gender = require("@prisma/client").Gender

const DEFAULT_SENIOR_PASSWORD = process.env.DEV_DEFAULT_SENIOR_PASSWORD || "1234"
const DEFAULT_PROFESSIONAL_PASSWORD = process.env.DEFAULT_PROFESSIONAL_PASSWORD || "pro123"
const DEFAULT_PROFILE_PICTURE = "https://i.pinimg.com/originals/58/51/2e/58512eb4e598b5ea4e2414e3c115bef9.jpg"
const DEV_DEFAULT_DEVELOPER_PASSWORD = process.env.DEV_DEFAULT_DEVELOPER_PASSWORD || "dev"

const generateRUT = (): string => {
	const numero: string = Math.floor(Math.random() * 100000000)
		.toString()
		.padStart(7, "0")

	const calcularDV = (rut: string): string => {
		let suma: number = 0
		let multiplicador: number = 2

		for (let i = rut.length - 1; i >= 0; i--) {
			suma += multiplicador * parseInt(rut[i])
			multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
		}

		const resto: number = 11 - (suma % 11)
		if (resto === 11) return "0"
		if (resto === 10) return "K"
		return resto.toString()
	}

	const dv: string = calcularDV(numero)
	return `${numero}${dv}`
}

const uploadImage = async (url: string, name: string, uploadPath: string) => {
	const STORAGE_URL = process.env.STORAGE_SERVICE_URL

	try {
		const response = await fetch(url)
		const blob = await response.blob()

		const formData = new FormData()
		formData.append("files", blob, `${name}.jpg`)

		const res = await fetch(`${STORAGE_URL}${uploadPath}`, {
			method: "POST",
			body: formData,
			headers: {
				"x-storage-key": process.env.STORAGE_KEY || "",
			},
		})

		if (!res.ok) throw new Error(`Error uploading image ${name}`)
	} catch (error) {
		console.error(error)
	}
}

const seed = async () => {
	await prisma.$transaction([
		prisma.event.deleteMany(),
		prisma.professional.deleteMany(),
		prisma.center.deleteMany(),
		prisma.service.deleteMany(),
		prisma.senior.deleteMany(),
		prisma.administrator.deleteMany(),
	])

	console.log("All records dropped.")

	await uploadImage(DEFAULT_PROFILE_PICTURE, "default-profile", "/upload?path=%2Fusers")

	const data = JSON.parse(readFileSync("./src/data.json", "utf-8"))
	const services = data.services
	const centers = data.centers
	const admins = data.administrators
	const professionals = data.professionals

	for (const admin of admins) {
		const AdminRUT = generateRUT()

		await prisma.administrator.upsert({
			where: { id: AdminRUT },
			create: {
				id: AdminRUT,
				email: admin.email,
				password: await hash(DEV_DEFAULT_DEVELOPER_PASSWORD, 10),
				name: admin.name,
			},
			update: {},
		})
	}

	for (const center of centers) {
		await prisma.center.upsert({
			where: { id: center.id },
			create: {
				id: center.id,
				name: center.name,
				address: center.address,
				phone: center.phone,
				color: center.color,
			},
			update: {},
		})

		await uploadImage(center.img, center.id.toString(), "/upload?path=%2Fcenters")

		for (const service of services) {
			const serviceExists = await prisma.service.findUnique({ where: { id: service.id } })
			await prisma.service.upsert({
				where: { id: service.id },
				create: {
					id: service.id,
					name: service.name,
					title: service.title,
					description: service.description,
					color: service.color,
				},
				update: {},
			})

			if (!serviceExists) {
				await uploadImage(service.img, service.id.toString(), "/upload?path=%2Fservices")

				for (let i = 0; i < service.professionals; i++) {
					const ProfessionalRUT = generateRUT()
					const professionalFirstName = faker.person.firstName()
					const professionalLastName = faker.person.lastName()
					const professionalEmail = `${professionalFirstName[0].toLowerCase()}${professionalLastName.toLowerCase()}@professionals.com`

					await prisma.professional.upsert({
						where: { id: ProfessionalRUT },
						create: {
							id: ProfessionalRUT,
							email: professionalEmail,
							password: await hash(DEFAULT_PROFESSIONAL_PASSWORD, 10),
							name: `${professionalFirstName} ${professionalLastName}`,
							serviceId: service.id,
						},
						update: {},
					})
				}
			}
		}

		for (let i = 0; i < 200; i++) {
			const SeniorRUT = generateRUT()
			const seniorFirstName = faker.person.firstName()
			const seniorLastName = faker.person.lastName()

			const seniorEmail = `${seniorFirstName[0].toLowerCase()}${seniorLastName.toLowerCase()}@seniors.com`

			await prisma.senior.upsert({
				where: { id: generateRUT() },
				create: {
					id: SeniorRUT,
					email: seniorEmail,
					password: await hash(DEFAULT_SENIOR_PASSWORD, 10),
					name: `${seniorFirstName} ${seniorLastName}`,
					address: faker.location.streetAddress(),
					birthDate: faker.date.between({ from: "1940-01-01", to: "1965-12-31" }),
					validated: Math.floor(Math.random() * 1000) % 2 === 0,
					gender: Math.floor(Math.random() * 1000) % 2 === 0 ? Gender.MA : Gender.FE,
				},
				update: {},
			})
		}
	}

	for (const professional of professionals) {
		const ProfessionalRUT = generateRUT()

		await prisma.professional.upsert({
			where: { id: ProfessionalRUT },
			create: {
				id: ProfessionalRUT,
				email: professional.email,
				password: await hash(DEV_DEFAULT_DEVELOPER_PASSWORD, 10),
				name: professional.name,
				serviceId: Math.floor(Math.random() * 6) + 1,
			},
			update: {},
		})
	}
}

seed()
	.then(() => console.log("Seeding done!"))
	.catch((error) => console.error("Error en la función seed:", error))
