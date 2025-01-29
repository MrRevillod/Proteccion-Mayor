import { hash } from "bcrypt"
import { Faker, es } from "@faker-js/faker"
import { readFileSync } from "node:fs"
import { PrismaClient, Gender } from "@prisma/client"

import fs from "node:fs"
import dayjs from "dayjs"
import axios from "axios"
import colors from "ansi-colors"

import * as utils from "./utils"

const faker = new Faker({ locale: [es] })
const prisma = new PrismaClient()

const DEFAULT_SENIOR_PASSWORD = process.env.DEV_DEFAULT_SENIOR_PASSWORD || "1234"
const DEFAULT_PROFESSIONAL_PASSWORD = process.env.DEV_DEFAULT_PROFESSIONAL_PASSWORD || "pro123"
const DEV_DEFAULT_DEVELOPER_PASSWORD = process.env.DEV_DEFAULT_DEVELOPER_PASSWORD || "dev"

const DEFAULT_PROFILE_PICTURE = "https://i.pinimg.com/originals/58/51/2e/58512eb4e598b5ea4e2414e3c115bef9.jpg"

const REG_IMAGES = ["./src/data/dni-a.jpg", "./src/data/dni-b.jpg", "./src/data/social.png"]

const DNIA = fs.readFileSync(REG_IMAGES[0])
const DNIB = fs.readFileSync(REG_IMAGES[1])
const RSHD = fs.readFileSync(REG_IMAGES[2])

const RSH = {
	RSH_0_40: "RSH_0_40",
	RSH_41_50: "RSH_41_50",
	RSH_61_70: "RSH_61_70",
	RSH_71_80: "RSH_71_80",
	RSH_81_90: "RSH_81_90",
	RSH_91_100: "RSH_91_100",
}

const seed = async () => {
	console.log(colors.yellow.bold("\n🌱 Starting database seeding...\n"))

	await Promise.all([
		utils.cleanDatabase(),
		utils.uploadImage(DEFAULT_PROFILE_PICTURE, "default-profile", "/upload?path=%2Fusers"),
	])

	const data = JSON.parse(readFileSync("./src/data/data.json", "utf-8"))

	const centers = data.centers
	const sectors = data.sectors
	const services = data.services
	const operatives = data.operatives
	const professionals = data.professionals
	const functionaries = data.functionaries
	const dailySessions = data.dailySessions
	const administrators = data.administrators

	const adminBar = utils.createProgressBar("Administrators", administrators.length)
	adminBar.start(administrators.length, 0, { title: "Administrators" })

	for (const [index, admin] of administrators.entries()) {
		const rut = utils.generateRUT()
		await prisma.staff.upsert({
			where: { id: rut },
			create: {
				id: rut,
				email: admin.email ?? "",
				password: await hash(DEV_DEFAULT_DEVELOPER_PASSWORD, 10),
				name: admin.name ?? "",
				role: "ADMIN",
			},
			update: {},
		})

		adminBar.update(index + 1)
	}

	adminBar.stop()

	const serviceBar = utils.createProgressBar("Services", services.length)
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

			await utils.uploadImage(service.img, service.id.toString(), "/upload?path=%2Fservices")

			for (let i = 0; i < service.professionals; i++) {
				const ProfessionalRUT = utils.generateRUT()
				const professionalFirstName = faker.person.firstName()
				const professionalLastName = faker.person.lastName()
				const professionalEmail = utils.generateEmail(
					professionalFirstName,
					professionalLastName,
					"professionals.com",
				)

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

	const centerBar = utils.createProgressBar("Centers", centers.length)
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

		await utils.uploadImage(center.img, center.id.toString(), "/upload?path=%2Fcenters")
		centerBar.update(centerIndex + 1)
	}

	centerBar.stop()

	const SectorsBar = utils.createProgressBar("Sectors", sectors.length)
	SectorsBar.start(sectors.length, 0, { title: "Sectors" })

	for (const sector of sectors) {
		await prisma.sector.upsert({
			where: { id: sector.id },
			create: {
				id: sector.id,
				name: sector.name,
			},
			update: {},
		})

		SectorsBar.increment()
	}

	SectorsBar.stop()

	const functionaryBar = utils.createProgressBar("Functionaries", functionaries.length)
	functionaryBar.start(functionaries.length, 0, { title: "Functionaries" })

	const centerIds = Array.from({ length: 16 }, (_, i) => Math.floor(i / 2) + 1)

	for (let i = 0; i < centers.length * 2; i++) {
		const functionaryRUT = utils.generateRUT()

		await prisma.staff.upsert({
			where: { id: functionaryRUT },
			create: {
				id: functionaryRUT,
				email: faker.internet.email(),
				password: await hash(DEV_DEFAULT_DEVELOPER_PASSWORD, 10),
				name: `${faker.person.firstName()} ${faker.person.lastName()}`,
				centerId: centerIds[i],
				role: "FUNCTIONARY",
			},
			update: {},
		})

		functionaryBar.update(i + 1)
	}

	functionaryBar.stop()

	const seniorBar = utils.createProgressBar("Pre-checked Seniors", 50)
	seniorBar.start(50, 0, { title: "Pre-checked Seniors" })

	for (let i = 0; i < 50; i++) {
		const SeniorRUT = utils.generateRUT()
		const seniorFirstName = faker.person.firstName()
		const seniorLastName = faker.person.lastName()
		const nSectors = await prisma.sector.count()
		const sectorId = Math.floor(Math.random() * nSectors) + 1

		const randomStaff = (await prisma.$queryRaw`
			SELECT * FROM Staff WHERE role = "FUNCTIONARY" ORDER BY RAND() LIMIT 1
		`) as any[]

		const staffId = randomStaff[0].id

		const senior = await prisma.senior.upsert({
			where: { id: utils.generateRUT() },
			create: {
				id: SeniorRUT,
				email: utils.generateEmail(seniorFirstName, seniorLastName, "seniors.com"),
				password: await hash(DEFAULT_SENIOR_PASSWORD, 10),
				name: `${seniorFirstName} ${seniorLastName}`,
				address: faker.location.streetAddress(),
				birthDate: faker.date.between({ from: "1940-01-01", to: "1965-12-31" }),
				validated: Math.floor(Math.random() * 1000) % 2 === 0,
				gender: Math.floor(Math.random() * 1000) % 2 === 0 ? Gender.MA : Gender.FE,
				phone: utils.generateCL_PHONE(),
				sectorId,
				rsh: utils.getRandomEnumValue(RSH),
				registeredBy: staffId,
			},
			update: {},
		})

		const formdataSenior = new FormData()

		formdataSenior.append("files", new Blob([DNIA], { type: "image/jpg" }), "dni-a.jpg")
		formdataSenior.append("files", new Blob([DNIB], { type: "image/jpg" }), "dni-b.jpg")
		formdataSenior.append("files", new Blob([RSHD], { type: "image/png" }), "social.png")

		await axios.post(
			`${process.env.SERVER_BASE_URL}/api/storage/upload?path=%2Fseniors%2F${senior.id}`,
			formdataSenior,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					"X-storage-key": process.env.STORAGE_KEY,
				},
			},
		)

		const mobSeniorRUT = utils.generateRUT()
		const mobSeniorLastName = faker.person.lastName()
		const mobSeniorFirstName = faker.person.firstName()

		const formData = new FormData()

		formData.append("dni-a", new Blob([DNIA], { type: "image/jpg" }), "dni-a.jpg")
		formData.append("dni-b", new Blob([DNIB], { type: "image/jpg" }), "dni-b.jpg")
		formData.append("social", new Blob([RSHD], { type: "image/png" }), "social.png")

		formData.append("rut", mobSeniorRUT)
		formData.append("email", utils.generateEmail(mobSeniorFirstName, mobSeniorLastName, "seniors.com"))
		formData.append("pin", "1234")
		formData.append("phone", utils.generateCL_PHONE())

		await axios.post(`${process.env.SERVER_BASE_URL}/api/dashboard/seniors/new-mobile`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})

		seniorBar.update(i + 1)
	}

	seniorBar.stop()

	const sessionBar = utils.createProgressBar("Daily Sessions", dailySessions.length)
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

	const staticProfessionalsBar = utils.createProgressBar("Static Professionals", professionals.length)
	staticProfessionalsBar.start(professionals.length, 0, { title: "Static Professionals" })

	for (const [index, professional] of professionals.entries()) {
		await prisma.professional.upsert({
			where: { id: professional.rut },
			create: {
				id: professional.rut,
				email: professional.email,
				password: await hash(DEFAULT_PROFESSIONAL_PASSWORD, 10),
				name: professional.name,
				minutesPerSession: Number(professional.minutesPerSession),
				serviceId: professional.serviceId,
			},
			update: {},
		})

		staticProfessionalsBar.update(index + 1)
	}

	staticProfessionalsBar.stop()

	const OperativesBar = utils.createProgressBar("Operatives", operatives.length)
	OperativesBar.start(operatives.length, 0, { title: "Operatives" })

	const firstOperativeStartDate = dayjs("2025-01-03").hour(9).startOf("hour")
	const firstOperativeEndDate = dayjs("2025-01-03").hour(15).startOf("hour")

	for (const [index, operative] of operatives.entries()) {
		const randomServices: number[] = []
		const randomProfessionals: string[] = []

		const randCenter = await prisma.center.findMany({
			take: 1,
			orderBy: { id: "asc" },
			skip: Math.floor(Math.random() * (await prisma.center.count())),
			select: { id: true },
		})

		for (let i = 0; i < 8; i++) {
			await prisma.$queryRaw`SELECT * FROM Professional ORDER BY RAND() LIMIT 1`
				.then((res: any) => {
					if (!randomProfessionals.includes(res[0].id)) {
						randomProfessionals.push(res[0].id)

						if (!randomServices.includes(res[0].serviceId)) {
							randomServices.push(res[0].serviceId)
						}
					}
				})
				.catch((error) => {
					console.error(error)
				})
		}

		await Promise.all([
			prisma.operative.upsert({
				where: { id: operative.id },
				create: {
					id: operative.id,
					name: operative.name,
					description: operative.description,
					start: firstOperativeStartDate.add(index, "week").toDate(),
					end: firstOperativeEndDate.add(index, "week").toDate(),
					centerId: randCenter[0].id,
					professionals: { connect: randomProfessionals.map((id) => ({ id })) },
					services: { connect: randomServices.map((id) => ({ id })) },
				},
				update: {},
			}),

			utils.uploadImage(operative.image, operative.id.toString(), "/upload?path=%2Foperatives"),
		])

		OperativesBar.update(index + 1)
	}

	OperativesBar.stop()

	console.log(colors.green.bold("\n✨ Database seeding completed successfully!\n"))
}

seed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(colors.red.bold("\n❌ Error during seeding:"), error)
		process.exit(1)
	})
