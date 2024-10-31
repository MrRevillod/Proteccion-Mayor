import PageLayout from "../../../layouts/PageLayout"
import { message } from "antd"
import { Loading } from "../../../components/Loading"
import { Calendar } from "../../../components/Calendar"
import { getEvents } from "../../../lib/actions"
import { useRequest } from "../../../hooks/useRequest"
import { useLocation } from "react-router-dom"
import React, { useState } from "react"
import { Events, Event, Senior } from "../../../lib/types"

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
			<div className="flex flex-row gap-4 w-full bg-gray-50 dark:bg-primary-dark">
				{loading && <Loading />}
				<div className="flex flex-col w-2/5 p-4">
					<h2 className="text-xl font-semibold mb-4">Lista de Eventos</h2>
					<ul className="list-disc pl-4">
						{Object.values(events || {}).map((event: Event) => (
							<li key={event.id} className="mb-2">
								<p>
									<strong>Servicio:</strong> {event.service?.name}
								</p>
								<p>
									<strong>Profesional:</strong> {event.professional?.name}
								</p>
								<p>
									<strong>Fecha inicio:</strong> {new Date(event.start).toLocaleString()}
								</p>
								<p>
									<strong>Fecha termino:</strong> {new Date(event.end).toLocaleString()}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</PageLayout>
	)
}

export default SeniorHistoryRequestPage
