import clsx from "clsx"
import dayjs from "dayjs"
import React from "react"

import { Event } from "../lib/types"
import { Pagination } from "antd"
import { usePagination } from "../hooks/usePagination"

import "../main.css"

interface UpcomingEventsProps {
	events: Event[]
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
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
		<section className="w-1/5 bg-white dark:bg-primary-dark p-4 rounded-lg">
			<h2 className="text-xl font-bold text-dark dark:text-light">Próximas atenciones</h2>
			<div className="flex flex-col gap-2 h-full py-4 justify-between">
				<div className={containerClasses}>
					{events.length === 0 && (
						<div className="text-center text-neutral-400">No hay atenciones próximas</div>
					)}

					{paginatedData.map((event) => {
						return (
							<div
								key={event.id}
								className="relative flex flex-col"
								style={{ "--bg-color": event.backgroundColor } as React.CSSProperties}
							>
								<div className="py-2 flex flex-col gap-2 items-start rounded-lg p-2 event-card">
									<p className="font-semibold text-base text-dark dark:text-light">{event.title}</p>
									<p className="text-sm text-dark dark:text-light">{event.center?.name}</p>
									<p className="text-sm text-dark dark:text-light">
										{dayjs(event.start).format("DD/MM/YYYY HH:mm")}
									</p>
								</div>
								<hr className="border-gray-200 dark:border-none" />
							</div>
						)
					})}
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
