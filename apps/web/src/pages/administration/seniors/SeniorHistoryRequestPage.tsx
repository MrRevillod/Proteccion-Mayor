import PageLayout from "../../../layouts/PageLayout"
import { message } from "antd"
import { Loading } from "../../../components/Loading"
import { getEvents } from "../../../lib/actions"
import { useRequest } from "../../../hooks/useRequest"
import { useLocation } from "react-router-dom"
import React, { useState } from "react"
import { Events, Event, Senior } from "../../../lib/types"
import { UpcomingEvents } from "@/components/UpcomingEvents"

const SeniorHistoryRequestPage: React.FC = () => {
	const location = useLocation()
	const senior = location.state?.senior as Senior
	const [events, setEvents] = useState<Event[]>([])

	const { error, loading } = useRequest<Events>({
		action: getEvents,
		query: `seniorId=${senior?.id}`,
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
					title={senior?.name}
					events={events}
					professional={true}
					dateEvent={true}
					width="100%"
				/>
			</div>
		</PageLayout>
	)
}

export default SeniorHistoryRequestPage
