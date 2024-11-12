import PageLayout from "../../layouts/PageLayout"
import { message } from "antd"
import { Loading } from "../../components/Loading"
import { Calendar } from "../../components/Calendar"
import { getEvents } from "../../lib/actions"
import { useRequest } from "../../hooks/useRequest"
import { useLocation } from "react-router-dom"
import React, { useState } from "react"
import { Events, Event } from "../../lib/types"
import { UpcomingEvents } from "@/components/UpcomingEvents"

const SeniorHistoryRequestPage: React.FC = () => {
	const location = useLocation()
	const data = location.state?.data as any
	const type = location.state?.type as any
	const [events, setEvents] = useState<Event[]>([])

	const { error, loading } = useRequest<Events>({
		action: getEvents,
		query: `${type}Id=${data?.id}`,
		onSuccess: (data) => {
			setEvents(data.formatted)
		},
	})

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout pageTitle="Historial Personal">
			<div className="w-full dark:bg-primary-dark">
				{loading && <Loading />}
				<UpcomingEvents
					title={data?.name}
					events={events}
					professional={type === "professional"}
					center={type === "professional"}
					senior={type === "senior"}
					dateEvent={true}
					width="100%"
				/>
			</div>
		</PageLayout>
	)
}

export default SeniorHistoryRequestPage
