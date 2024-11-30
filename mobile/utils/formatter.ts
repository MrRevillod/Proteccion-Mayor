export const formatDate = (unformattedDate: string) => {
	const date = new Date(unformattedDate)
	if (isNaN(date.getTime())) {
		throw new Error("Fecha inválida")
	}
	return date.toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	})
}

export function calculateAge(unformattedDate: string): number {
	const birthDate = new Date(unformattedDate)

	if (isNaN(birthDate.getTime())) {
		throw new Error("Fecha inválida")
	}

	const today = new Date()
	let age = today.getFullYear() - birthDate.getFullYear()
	const monthDifference = today.getMonth() - birthDate.getMonth()

	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
		age--
	}

	return age
}

export function formatRUT(rut: string): string {
	const cleanRUT = rut.replace(/[^\dkK]/g, "")

	if (cleanRUT.length < 2) {
		throw new Error("RUT inválido. Debe contener al menos un dígito y el dígito verificador.")
	}

	const dv = cleanRUT.slice(-1).toUpperCase()
	const rutBody = cleanRUT.slice(0, -1)

	const formattedRutBody = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
	return `${formattedRutBody}-${dv}`
}
