import dayjs from "dayjs"
import autotable from "jspdf-autotable"

import { jsPDF } from "jspdf"
import { notification } from "antd"
import { Event, Professional } from "./types"

export const generatePDF = (professional: Professional, events: Event[]) => {
	const headerData = {
		name: professional.name,
		service: professional.service.name,
		date: dayjs().format("DD/MM/YYYY"),
		center: "",
	}

	const columns = ["Nº", "Horario", "Nombre", "Teléfono", "Asistencia", "Firma          "]

	if (!events || events.length === 0) {
		notification.info({
			message: "Información",
			description: "No hay horas de atención registradas en la fecha seleccionada",
			duration: 3,
		})

		return
	}

	const data = events.map((event, index) => [
		(index + 1).toString(),
		`${dayjs(event.start).format("HH:mm")} - ${dayjs(event.end).format("HH:mm")}`,
		event.senior?.name && event.seniorId ? event.senior.name : "No reservado",
		event.senior?.phone ? event.senior.phone : "Sin teléfono Registrado",
		"",
		"",
	])

	headerData.center = events.at(0)?.center?.name ?? "No asignado"

	const doc = new jsPDF({ orientation: "landscape" })

	const margin = 15
	const lineHeight = 8
	let cursorY = margin

	doc.setFontSize(18)
	doc.setFont("helvetica", "bold")
	doc.text("Planilla de Asistencia programa Protección Mayor", margin, cursorY)

	const logoPath = "../../public/logo-municipalidad.jpg"
	const logoWidth = 30
	const logoHeight = 25
	doc.addImage(logoPath, "JPG", doc.internal.pageSize.width - margin - logoWidth, margin, logoWidth, logoHeight)

	cursorY += lineHeight * 1.5

	doc.setFontSize(10)
	doc.setFont("helvetica", "normal")
	doc.text(`Servicio de ${headerData.service}`, margin, cursorY)
	cursorY += lineHeight
	doc.text(`Profesional: ${headerData.name}`, margin, cursorY)
	cursorY += lineHeight
	doc.text(`Centro comunitario: ${headerData.center}`, margin, cursorY)
	cursorY += lineHeight
	doc.text(`Fecha: ${headerData.date}`, margin, cursorY)

	cursorY += lineHeight

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
