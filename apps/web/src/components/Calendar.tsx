import React from "react"
import dayjs from "dayjs"
import esLocale from "@fullcalendar/core/locales/es"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import { Events } from "@/lib/types"
import { Popover } from "antd"
import { useState } from "react"
import { useModal } from "@/context/ModalContext"

interface CalendarProps {
	events: Events
}

export const Calendar: React.FC<CalendarProps> = ({ events }) => {
	const { showModal } = useModal()
	const [popoverInfo, setPopoverInfo] = useState({
		visible: false,
		x: 0,
		y: 0,
		center: "",
		time: <></>,
	})

	const getEvent = (eventId: string) => events.byId[eventId]

	const handleEventMouseEnter = (info: any) => {
		const event = getEvent(info.event.id)
		const rect = info.el.getBoundingClientRect()
		const calendarRect = document.querySelector(".fc")?.getBoundingClientRect()

		if (calendarRect) {
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
		showModal("Create", info)
	}

	const isWeekend = (date: Date) => {
		const day = date.getDay()
		return day === 0 || day === 6
	}

	return (
		<div className="w-3/5 bg-white dark:bg-primary-dark p-4 rounded-lg max-h-[70vh] overflow-y-auto overflow-x-auto relative">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={events.formatted}
				eventClick={(event) => showModal("Edit", getEvent(event.event.id))}
				eventMouseEnter={handleEventMouseEnter}
				eventMouseLeave={handleEventMouseLeave}
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
				locale={esLocale}
				editable={false}
				droppable={false}
				selectable={true}
				dateClick={(info) => handleDateClick(info)}
				height="auto"
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
