import clsx from "clsx"
import dayjs from "dayjs"
import React from "react"

import { Event } from "../lib/types"
import { Pagination } from "antd"
import { usePagination } from "../hooks/usePagination"
import { AiOutlineCalendar, AiOutlineUser, AiFillBank } from "react-icons/ai"

import "../main.css"

interface UpcomingEventsProps {
	events: Event[]
	title: string
	center?: boolean
	professional?: boolean
	senior?: boolean
	dateEvent?: boolean
	width?: string
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ ...props }) => {
	const {
		title,
		events,
		center = false,
		professional = false,
		dateEvent = false,
		width = "20%",
		senior = false,
	} = props

	const paginationClasses = clsx(
		events.length > 5 ? "fixed bottom-28 right-24" : "hidden",
		"fixed bottom-28 right-24",
	)

	const { paginatedData, currentPage, pageSize, total, onPageChange } = usePagination({
		data: events,
		defaultPageSize: 5,
	})

	const containerClasses = clsx(
		"flex flex-col gap-2 h-full",
		events.length === 0 ? "justify-center items-center" : "",
	)

	return (
		<section className="bg-white dark:bg-primary-dark p-4 rounded-lg" style={{ width: width }}>
			<h2 className="text-xl font-bold text-dark dark:text-light">{title}</h2>
			<div className="flex flex-col gap-2 h-full py-4 justify-between">
				<div className={containerClasses}>
					{events.length === 0 && (
						<div className="text-center text-neutral-400">No hay atenciones próximas</div>
					)}
					{paginatedData.map((event) => (
						<div
							key={event.id}
							className="relative flex overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg"
						>
							<div
								className="w-2 absolute left-0 top-0 bottom-0"
								style={{ backgroundColor: event.backgroundColor }}
							></div>
							<div className="flex-1 py-2 flex flex-col gap-2 items-start p-4 ml-2 event-card">
								{professional ? (
									<p className="font-semibold text-x1 text-dark dark:text-light flex items-center gap-2">
										<AiOutlineUser className="h-5 w-5 text-muted-foreground" />
										{event.senior?.name}
									</p>
								) : (
									<p className="font-semibold text-xl text-dark dark:text-light flex items-center gap-2">
										{event.title}
									</p>
								)}

								{center && (
									<p className="text-sm text-dark dark:text-light flex items-center gap-2">
										<AiFillBank className="h-5 w-5 text-muted-foreground" />
										{event.center?.name}
									</p>
								)}

								{senior && (
									<p className="text-sm text-dark dark:text-light flex items-center gap-2">
										<AiOutlineUser className="h-5 w-5 text-muted-foreground" />
										{event.professional?.name}
									</p>
								)}

								{/* FECHA DE EVENTOS */}
								{!dateEvent ? (
									<p className="text-sm text-dark flex gap-2 dark:text-light">
										<AiOutlineCalendar className="h-5 w-5 text-muted-foreground" />
										{dayjs(event.start).format("DD/MM/YYYY HH:mm")}
									</p>
								) : (
									<p className="text-sm text-dark flex gap-2 dark:text-light">
										<AiOutlineCalendar className="h-5 w-5 text-muted-foreground" />
										{dayjs(event.start).format("DD/MM/YYYY HH:mm")}
										{" - "}
										{dayjs(event.end).format("HH:mm")}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
				<Pagination
					defaultPageSize={5}
					pageSizeOptions={["4", "8", "12", "16"]}
					current={currentPage}
					pageSize={pageSize}
					total={total}
					onChange={onPageChange}
					size="default"
					align="end"
					className={paginationClasses}
				/>
			</div>
		</section>
	)
}
