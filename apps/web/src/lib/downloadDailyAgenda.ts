import dayjs from "dayjs"
import autotable from "jspdf-autotable"

import { api } from "./axios"
import { jsPDF } from "jspdf"
import { Event, Professional } from "./types"
import { notification } from "antd"

export const getEvents = async (id: string, start: string, end: string): Promise<Event[]> => {
	try {
		const response = await api.get(
			`/dashboard/events?professionalId=${id}&start=${start}&end=${end}`
		)
		return response.data.values.formatted as Event[]
	} catch (error) {
		console.error(error)
		return []
	}
}

export const generatePDF = async (professional: Professional) => {
	const start = dayjs().startOf("day").toISOString()
	const end = dayjs().endOf("day").toISOString()

	const headerData = {
		name: professional.name,
		service: professional.service.name,
		date: dayjs().format("DD/MM/YYYY"),
		center: "",
	}

	const columns = ["Nº", "Horario", "Nombre de la Persona Mayor", "Asistencia", "Firma          "]
	const events = await getEvents(professional.id, start, end)

	if (!events || events.length === 0) {
		notification.info({
			message: "Información",
			description: "No hay horas de atención programadas para hoy",
		})

		return
	}

	const data = events.map((event, index) => [
		(index + 1).toString(),
		`${dayjs(event.start).format("HH:mm")} - ${dayjs(event.end).format("HH:mm")}`,
		event.senior?.name && event.seniorId ? event.senior.name : "No reservado",
		"",
		"",
	])

	headerData.center = events.at(0)?.center?.name ?? "No asignado"

	const doc = new jsPDF()

	const margin = 25
	const lineHeight = 8
	let cursorY = margin

	doc.setFontSize(18)
	doc.setFont("helvetica", "bold")
	doc.text("Planilla de Asistencia programa Protección Mayor", 105, cursorY, { align: "center" })

	cursorY += lineHeight * 2

	doc.setFontSize(12)
	doc.setFont("helvetica", "normal")
	doc.text(`Servicio de ${headerData.service}`, margin, cursorY)
	cursorY += lineHeight
	doc.text(`Profesional: ${headerData.name}`, margin, cursorY)
	cursorY += lineHeight
	doc.text(`Centro comunitario: ${headerData.center}`, margin, cursorY)
	cursorY += lineHeight
	doc.text(`Fecha: ${headerData.date}`, margin, cursorY)

	cursorY += lineHeight * 2

	autotable(doc, {
		startY: cursorY,
		margin: { left: margin, right: margin },
		head: [columns],
		body: data,
		headStyles: { fillColor: [4, 108, 78], textColor: [255, 255, 255] },
		bodyStyles: { fontSize: 10, cellPadding: 3 },
		alternateRowStyles: { fillColor: [240, 240, 240] },
		theme: "grid",
	})

	const pageHeight = doc.internal.pageSize.height
	const footerMargin = 20

	cursorY = pageHeight - footerMargin

	doc.setFontSize(12)
	doc.text("Firma del profesional encargado:", margin, cursorY)
	doc.line(margin + 70, cursorY, margin + 160, cursorY)

	doc.save("planilla_asistencia.pdf")

	return
}
