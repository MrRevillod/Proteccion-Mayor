import colors from "ansi-colors"
import cliProgress from "cli-progress"
import { prisma } from "."

export const generateRUT = (): string => {
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

export const generateEmail = (name: string, lastname: string, domain: string): string => {
	const cleanString = (str: string) => str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "")

	const initial = cleanString(name)[0]
	const cleanLastName = cleanString(lastname)

	return `${initial}.${cleanLastName}@${domain}`
}

export const generateCL_PHONE = (): string => {
	let phone = "9"

	for (let i = 0; i < 8; i++) {
		phone += Math.floor(Math.random() * 10)
	}

	return phone
}

export const uploadImage = async (url: string, name: string, uploadPath: string) => {
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

export const createProgressBar = (title: string, total: number) => {
	return new cliProgress.SingleBar(
		{
			format: colors.cyan("{title}") + " |" + colors.cyan("{bar}") + "| {percentage}% || {value}/{total}",
			barCompleteChar: "\u2588",
			barIncompleteChar: "\u2591",
			hideCursor: true,
		},
		cliProgress.Presets.shades_classic,
	)
}

export const cleanDatabase = async () => {
	await prisma.$transaction([
		prisma.event.deleteMany(),
		prisma.professional.deleteMany(),
		prisma.center.deleteMany(),
		prisma.service.deleteMany(),
		prisma.senior.deleteMany(),
		prisma.operative.deleteMany(),
		prisma.dailySessions.deleteMany(),
		prisma.revokedToken.deleteMany(),
		prisma.staff.deleteMany(),
		prisma.sector.deleteMany(),
	])
}

export const getRandomEnumValue = (enumObject: Record<string, any>): any => {
	const values = Object.values(enumObject)
	const randomIndex = Math.floor(Math.random() * values.length)
	return values[randomIndex]
}
