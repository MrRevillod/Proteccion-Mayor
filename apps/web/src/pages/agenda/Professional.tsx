import React from "react"
import PageLayout from "../../layouts/PageLayout"
import CreateEvent from "../../components/forms/create/Event"
import UpdateEvent from "../../components/forms/update/Event"
import ConfirmAction from "../../components/ConfirmAction"

import { message } from "antd"
import { Loading } from "../../components/Loading"
import { Calendar } from "../../components/Calendar"
import { useRequest } from "../../hooks/useRequest"
import { EventFilter } from "../../components/EventFilter"
import { UpcomingEvents } from "../../components/UpcomingEvents"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { filterUpcomingEvents, selectDataFormatter } from "../../lib/formatters"
import { Center, Events, Event, SuperSelectField } from "../../lib/types"
import { deleteEvent, getCenters, getEvents } from "../../lib/actions"
import { useAuth } from "@/context/AuthContext"
import { useModal } from "@/context/ModalContext"

const ProfessionalAgendaPage: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const [pageQuery, setPageQuery] = useState<string>(new URLSearchParams(location.search).toString())

	const [events, setEvents] = useState<Events>({} as Events)
	const [centers, setCenters] = useState<SuperSelectField[]>([])
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

	// Se obtiene la query de la URL para utilizarla en el filtro de eventos
	useEffect(() => {
		const query = new URLSearchParams(location.search).toString()
		setPageQuery(query)
	}, [location])

	const { user } = useAuth()

	// Se obtienen los eventos de la base de datos
	// y se formatean para ser mostrados en el calendario
	// refetch es una función que permite volver a obtener los eventos
	// en caso de que se realice alguna acción que modifique los eventos

	const { error, refetch, loading } = useRequest<Events>({
		action: getEvents,
		query: `professionalId=${user?.id}&${pageQuery}`,
		onSuccess: (events) => {
			setEvents(events)
			setUpcomingEvents(filterUpcomingEvents(events.formatted))
		},
	})

	useRequest<Center[]>({
		action: getCenters,
		query: "select=name,id",
		onSuccess: (data) => selectDataFormatter({ data, setData: setCenters }),
	})

	const onFilterSubmit = (data: any) => {
		const { centerFilter } = data
		const query = new URLSearchParams()
		if (centerFilter) query.append("centerId", centerFilter)
		navigate({ search: query.toString() })
	}

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout pageTitle="Agenda y horas de atención" create>
			<div className="flex flex-row gap-4 w-full bg-gray-50 dark:bg-primary-dark">
				{loading && <Loading />}
				<EventFilter data={{ centers }} onSubmit={onFilterSubmit} />
				<Calendar events={events} />
				<UpcomingEvents title="Próximas atenciones" center={true} events={upcomingEvents} />
			</div>

			<CreateEvent centers={centers} refetch={refetch} />
			<UpdateEvent centers={centers} refetch={refetch} />

			<ConfirmAction<Event>
				text="¿Estás seguro(a) de que deseas eliminar este evento?"
				action={deleteEvent}
				refetch={refetch}
			/>
		</PageLayout>
	)
}

export default ProfessionalAgendaPage
