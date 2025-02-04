import dayjs from "dayjs"
import autotable from "jspdf-autotable"

import { jsPDF } from "jspdf"
import { notification } from "antd"
import { Event, Professional, Report, Splitted } from "./types"

export const generatePDF = (professional: Professional, events: Event[], date: string) => {
	const headerData = {
		name: professional.name,
		service: professional.service.name,
		date: dayjs(date).format("DD/MM/YYYY"),
		center: "",
	}

	const columns = ["Nº", "Horario", "RUT", "Nombre", "Teléfono", "Asistencia", "Firma          "]

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
		event.senior?.id ? event.senior.id : "",
		event.senior?.name && event.seniorId ? event.senior.name : "No reservado",
		event.senior?.phone ? event.senior.phone : !event.senior ? "" : "Sin teléfono Registrado",
		event.assistance
			? "Asiste"
			: event?.seniorId && !event.assistance && dayjs(event.end).isBefore(dayjs())
				? "No asiste"
				: "",
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

export function generateReportPDF(report: Report) {
	const doc = new jsPDF()

	const headerData = {
		title: `Reporte de atenciones del ${dayjs(report.head.from).format("DD-MM-YYYY")} al ${dayjs(report.head.to).format("DD-MM-YYYY")}`,
		profesional: report.head.professionalName || null,
		service: report.head.serviceName || null,
		center: report.head.centerName || null,
	}
	const margin = 20
	const lineHeight = 8
	let cursorY = margin

	doc.setFontSize(14)
	doc.setFont("helvetica", "bold")
	doc.text(headerData.title, margin, cursorY)

	const logoPath = "../../public/logo-municipalidad.jpg"
	const logoWidth = 30
	const logoHeight = 25
	doc.addImage(logoPath, "JPG", doc.internal.pageSize.width - margin - logoWidth, 5, logoWidth, logoHeight)

	cursorY += lineHeight * 1.5

	doc.setFontSize(10)
	doc.setFont("helvetica", "normal")

	headerData.service && doc.text(`Servicio de ${headerData.service}`, margin, cursorY)
	headerData.service && (cursorY += lineHeight)
	headerData.profesional && doc.text(`Profesional: ${headerData.profesional}`, margin, cursorY)
	headerData.profesional && (cursorY += lineHeight)
	headerData.center && doc.text(`Centro comunitario: ${headerData.center}`, margin, cursorY)
	headerData.center && (cursorY += lineHeight)

	function createTable(
		title: string,
		data: Record<string, { assistance: number; absence: number; unreserved: number }>,
	) {
		const sortedData = Object.entries(data)
			.map(([key, values]) => ({ name: key, ...values }))
			.sort((a, b) => b.assistance + b.absence - (a.assistance + a.absence))

		const tableData = sortedData.map((row) => [row.name, row.assistance, row.absence, row.unreserved])

		doc.setFontSize(15)
		doc.text(title, margin, (doc as any).lastAutoTable.finalY + 1 + cursorY || 10 + cursorY)
		doc.setFontSize(10)

		autotable(doc, {
			head: [["Nombre", "Asistencia", "Ausencia", "No Reservado"]],
			body: tableData,
			startY: (doc as any).lastAutoTable.finalY + 5 + cursorY || 20 + cursorY,
			margin: { left: margin, right: margin },
			headStyles: { fillColor: [4, 108, 78], textColor: [255, 255, 255] },
			bodyStyles: { fontSize: 10, cellPadding: 1 },
			alternateRowStyles: { fillColor: [240, 240, 240] },
			theme: "grid",
		})
	}

	needTable(report.splitted.professional) && createTable("Profesionales", report.splitted.professional)
	needTable(report.splitted.center) && createTable("Centros", report.splitted.center)
	needTable(report.splitted.service) && createTable("Servicios", report.splitted.service)

	doc.save("report.pdf")
}
//return boolean

const needTable = (s: Splitted) => {
	return Object.keys(s).length > 0
}
