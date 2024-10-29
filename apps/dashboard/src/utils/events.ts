import { Event } from "@prisma/client"
import { AppError } from "@repo/lib"

export const canAddEvent = (events: Event[], newEvent: { start: Date; end: Date }): boolean => {
	// Ordenar los eventos por la fecha de inicio
	events.sort((a, b) => a.start.getTime() - b.start.getTime())

	// Revisar si el nuevo evento se superpone con los eventos existentes
	for (let i = 0; i < events.length; i++) {
		const event = events[i]

		// Si el nuevo evento termina antes de que el evento actual comience, no hay superposición
		if (newEvent.end <= newEvent.start) {
			throw new AppError(400, "Rango de tiempo invalido")
		}

		if (newEvent.end <= event.start) {
			continue
		}

		// Si el nuevo evento comienza después de que el evento actual termine, no hay superposición
		if (newEvent.start >= event.end) {
			continue
		}

		// Si cae aquí, entonces hay superposición
		return false
	}

	// Si pasa todas las validaciones, entonces se puede agregar el nuevo evento sin superposición
	return true
}
