import { hash } from "bcrypt"
import { Faker, es } from "@faker-js/faker"
import { readFileSync } from "node:fs"
import { PrismaClient, Gender } from "@prisma/client"

import colors from "ansi-colors"
import cliProgress from "cli-progress"

const faker = new Faker({ locale: [es] })

const prisma = new PrismaClient()

const DEFAULT_SENIOR_PASSWORD = process.env.DEV_DEFAULT_SENIOR_PASSWORD || "1234"
const DEFAULT_PROFESSIONAL_PASSWORD = process.env.DEV_DEFAULT_PROFESSIONAL_PASSWORD || "pro123"
const DEV_DEFAULT_DEVELOPER_PASSWORD = process.env.DEV_DEFAULT_DEVELOPER_PASSWORD || "dev"

const DEFAULT_PROFILE_PICTURE = "https://i.pinimg.com/originals/58/51/2e/58512eb4e598b5ea4e2414e3c115bef9.jpg"

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
	const STORAGE_URL = `${process.env.SERVER_BASE_URL}/api/storage`

	try {
		const response = await fetch(url)
		const blob = await response.blob()

		const formData = new FormData()
		formData.append("files", blob, `${name}.jpg`)

		const res = await fetch(`${STORAGE_URL}${uploadPath}`, {
			method: "POST",
			body: formData,
			headers: {
				"x-storage-key": process.env.STORAGE_KEY ?? "",
			},
		})

		if (!res.ok) throw new Error(`Error uploading image ${name}`)
	} catch (error) {}
}

const createProgressBar = (title: string, total: number) => {
	return new cliProgress.SingleBar(
		{
			format: colors.cyan("{title}") + " |" + colors.cyan("{bar}") + "| {percentage}% || {value}/{total}",
			barCompleteChar: "\u2588",
			barIncompleteChar: "\u2591",
			hideCursor: true,
		},
		cliProgress.Presets.shades_classic
	)
}

const seed = async () => {
	await prisma.$transaction([
		prisma.event.deleteMany(),
		prisma.professional.deleteMany(),
		prisma.center.deleteMany(),
		prisma.service.deleteMany(),
		prisma.senior.deleteMany(),
		prisma.administrator.deleteMany(),
		prisma.dailySessions.deleteMany(),
	])

	console.log(colors.yellow.bold("\n🌱 Starting database seeding...\n"))

	await uploadImage(DEFAULT_PROFILE_PICTURE, "default-profile", "/upload?path=%2Fusers")

	const data = JSON.parse(readFileSync("./src/data.json", "utf-8"))
	const { services, centers, administrators, professionals, dailySessions } = data

	const adminBar = createProgressBar("Administrators", administrators.length)
	adminBar.start(administrators.length, 0, { title: "Administrators" })

	for (const [index, admin] of administrators.entries()) {
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
		adminBar.update(index + 1)
	}
	adminBar.stop()

	const serviceBar = createProgressBar("Services", services.length)
	serviceBar.start(services.length, 0, { title: "Services" })

	for (const [serviceIndex, service] of services.entries()) {
		const serviceExists = await prisma.service.findUnique({ where: { id: service.id } })
		if (!serviceExists) {
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
						minutesPerSession: Number(service.minutesPerSession),
						serviceId: service.id,
					},
					update: {},
				})
			}
		}
		serviceBar.update(serviceIndex + 1)
	}
	serviceBar.stop()

	const centerBar = createProgressBar("Centers", centers.length)
	centerBar.start(centers.length, 0, { title: "Centers" })

	for (const [centerIndex, center] of centers.entries()) {
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
		centerBar.update(centerIndex + 1)
	}
	centerBar.stop()

	const seniorBar = createProgressBar("Seniors", 50)
	seniorBar.start(50, 0, { title: "Seniors" })

	for (let i = 0; i < 50; i++) {
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
		seniorBar.update(i + 1)
	}
	seniorBar.stop()

	const professionalBar = createProgressBar("Professionals", professionals.length)
	professionalBar.start(professionals.length, 0, { title: "Professionals" })

	for (const [index, professional] of professionals.entries()) {
		const ProfessionalRUT = generateRUT()

		await prisma.professional.upsert({
			where: { id: ProfessionalRUT },
			create: {
				id: ProfessionalRUT,
				email: professional.email,
				password: await hash(DEV_DEFAULT_DEVELOPER_PASSWORD, 10),
				name: professional.name,
				serviceId: Math.floor(Math.random() * 6) + 1,
				minutesPerSession: 30,
			},
			update: {},
		})
		professionalBar.update(index + 1)
	}
	professionalBar.stop()

	const sessionBar = createProgressBar("Daily Sessions", dailySessions.length)
	sessionBar.start(dailySessions.length, 0, { title: "Daily Sessions" })

	let index = 0

	for (const service of dailySessions) {
		for (const session of service.sessions) {
			await prisma.dailySessions.create({
				data: {
					centerId: session.centerId,
					serviceId: service.serviceId,
					quantity: session.quantity,
				},
			})
			index++
			sessionBar.update(index)
		}
	}

	sessionBar.stop()

	console.log(colors.green.bold("\n✨ Database seeding completed successfully!\n"))
}

seed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(colors.red.bold("\n❌ Error during seeding:"), error)
		process.exit(1)
	})
