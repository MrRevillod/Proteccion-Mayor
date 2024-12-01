import React from "react"
import PageLayout from "../../layouts/PageLayout"
import CreateEvent from "../../components/forms/create/Event"
import UpdateEvent from "../../components/forms/update/Event"
import ConfirmAction from "../../components/ConfirmAction"

import { message } from "antd"
import { Loading } from "../../components/Loading"
import { Calendar } from "../../components/Calendar"
import { useSocket } from "../../context/SocketContext"
import { useRequest } from "../../hooks/useRequest"
import { EventFilter } from "../../components/EventFilter"
import { UpcomingEvents } from "../../components/UpcomingEvents"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { filterUpcomingEvents, selectDataFormatter } from "../../lib/formatters"
import { Center, Event, Events, Professional, Service, SuperSelectField } from "../../lib/types"
import { deleteEvent, getCenters, getEvents, getProfessionals, getServices } from "../../lib/actions"

const AdministrationAgendaPage: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const [pageQuery, setPageQuery] = useState<string>(new URLSearchParams(location.search).toString())

	const [events, setEvents] = useState<Events>({} as Events)
	const [centers, setCenters] = useState<SuperSelectField[]>([])
	const [services, setServices] = useState<SuperSelectField[]>([])
	const [professionals, setProfessionals] = useState<Professional[]>([])
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

	const { eventListener } = useSocket()

	// Se obtiene la query de la URL para utilizarla en el filtro de eventos
	useEffect(() => {
		const query = new URLSearchParams(location.search).toString()
		setPageQuery(query)
	}, [location])

	// Se obtienen los eventos de la base de datos
	// y se formatean para ser mostrados en el calendario
	// refetch es una función que permite volver a obtener los eventos
	// en caso de que se realice alguna acción que modifique los eventos

	const { error, refetch, loading } = useRequest<Events>({
		action: getEvents,
		query: pageQuery,
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

	useRequest<Service[]>({
		action: getServices,
		query: "select=name,id",
		onSuccess: (data) => selectDataFormatter({ data, setData: setServices }),
	})

	useRequest<Professional[]>({
		action: getProfessionals,
		query: "select=name,id,serviceId",
		onSuccess: (data) => setProfessionals(data),
	})

	eventListener(["event:create", "event:update", "event:delete"], () => {
		refetch()
	})

	const onFilterSubmit = (data: any) => {
		const { centerFilter, serviceFilter, professionalFilter } = data
		const query = new URLSearchParams()
		if (centerFilter) query.append("centerId", centerFilter)
		if (serviceFilter) query.append("serviceId", serviceFilter)
		if (professionalFilter) query.append("professionalId", professionalFilter)

		navigate({ search: query.toString() })
	}

	if (error) message.error("Error al cargar los datos")

	return (
		<PageLayout pageTitle="Agenda y horas de atención" create>
			<div className="flex flex-row gap-4 w-full agenda-container bg-gray-50 dark:bg-primary-darker rounded-lg">
				{loading && <Loading />}
				<EventFilter data={{ centers, services, professionals }} onSubmit={onFilterSubmit} />
				<Calendar events={events} />
				<UpcomingEvents title="Próximas atenciones" center={true} events={upcomingEvents} />
			</div>

			<CreateEvent centers={centers} services={services} professionals={professionals} />
			<UpdateEvent centers={centers} professionals={professionals} />

			<ConfirmAction<Event> text="¿Estás seguro(a) de que deseas eliminar este evento?" action={deleteEvent} />
		</PageLayout>
	)
}

export default AdministrationAgendaPage
