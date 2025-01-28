import React, { useEffect } from "react"
import dayjs from "dayjs"
import esLocale from "@fullcalendar/core/locales/es"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import { Events, Operatives } from "@/lib/types"
import { useState } from "react"
import { useModal } from "@/context/ModalContext"
import { message, Popover } from "antd"

import "../main.css"

interface CalendarProps {
	events: Events
	operatives: Operatives
}

export const Calendar: React.FC<CalendarProps> = ({ events, operatives }) => {
	const { showModal } = useModal()
	const [popoverInfo, setPopoverInfo] = useState({
		visible: false,
		x: 0,
		y: 0,
		center: "",
		time: <></>,
	})

	const [combinedArray, setCombinedArray] = useState<any[]>([])

	useEffect(() => {
		if (events.formatted && operatives.formatted) {
			setCombinedArray([...events.formatted, ...operatives.formatted])
		}
	}, [events, operatives])

	const getEvent = (eventId: string) => {
		return events.byId[eventId]
	}

	const handleEventMouseEnter = (info: any) => {
		const event = getEvent(info.event.id)
		const rect = info.el.getBoundingClientRect()
		const calendarRect = document.querySelector(".fc")?.getBoundingClientRect()

		if (calendarRect && event) {
			setPopoverInfo({
				visible: true,
				x: rect.left - calendarRect.left,
				y: rect.top - calendarRect.top,
				center: event?.center?.name as string,
				time: (
					<div className="z-50">
						<p>{event?.seniorId ? event?.senior?.name : "Sin reserva"}</p>
						<p>
							{dayjs(event?.start).format("HH:mm")} - {dayjs(event?.end).format("HH:mm")}
						</p>
					</div>
				),
			})
		}
	}

	const handleEventMouseLeave = () => {
		setPopoverInfo({ ...popoverInfo, visible: false })
	}

	const handleDateClick = (info: any) => {
		const date = dayjs(info.date)

		if (date.isBefore(dayjs(), "day")) {
			message.error("No es posible crear eventos en fechas pasadas")
			return
		}

		const day = dayjs(info.date).day()
		const isWeekend = day === 0 || day === 6

		if (isWeekend) {
			message.error("No es posible crear eventos los fin de semana")
			return
		}

		showModal("Other", info)
	}

	const handleEdit = (info: any) => {
		const event = getEvent(info.event.id)

		if (!event) {
			return message.info("Para editar un Operativo tiene que dirigirse a la página de Operativos")
		}

		if (!event.seniorId && dayjs(event.start).isBefore(dayjs())) {
			message.info("No es posible editar eventos pasados sin reserva")
			return
		}

		showModal("Edit", event)
	}

	const isWeekend = (date: Date) => {
		const day = date.getDay()
		return day === 0 || day === 6
	}

	return (
		<div className="lg:w-3/5 w-full bg-white dark:bg-primary-dark p-4 rounded-lg max-h-[70vh] overflow-y-auto overflow-x-auto relative">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={combinedArray as any}
				eventClick={(event) => handleEdit(event)}
				eventMouseEnter={handleEventMouseEnter}
				eventMouseLeave={handleEventMouseLeave}
				fixedWeekCount={false}
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
				locale={esLocale}
				editable={false}
				droppable={false}
				selectable={false}
				dateClick={(info) => handleDateClick(info)}
				height="100%"
				timeZone="local"
				dayCellClassNames={(info) => {
					return isWeekend(info.date) ? "weekend-calendar-cell" : ""
				}}
				views={{
					dayGridMonth: {
						dayMaxEventRows: 3,
					},
					timeGridWeek: {
						display: "auto",
						dayMaxEvents: true,
						slotMinTime: "08:00:00",
						slotMaxTime: "20:00:00",
					},
					timeGridDay: {
						display: "auto",
						dayMaxEvents: true,
						dayMaxEventRows: 3,
						slotMinTime: "08:00:00",
						slotMaxTime: "20:00:00",
					},
				}}
				titleFormat={{ year: "numeric", month: "long" }}
			/>

			{popoverInfo.visible && (
				<Popover
					content={popoverInfo.time}
					title={popoverInfo.center}
					open={popoverInfo.visible}
					overlayClassName="z-100"
				>
					<div
						style={{
							position: "absolute",
							top: popoverInfo.y + 20,
							left: popoverInfo.x + 20,
							pointerEvents: "none",
						}}
					></div>
				</Popover>
			)}
		</div>
	)
}
