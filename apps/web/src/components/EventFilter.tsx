import React from "react"

import { Show } from "./ui/Show"
import { useAuth } from "@/context/AuthContext"
import { SuperSelect } from "./ui/SuperSelect"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Professional, SuperSelectField } from "../lib/types"
import { getIdsFromUrl, selectDataFormatter } from "../lib/formatters"

interface EventFilterProps {
	data: {
		centers: SuperSelectField[]
		services?: SuperSelectField[]
		professionals?: Professional[]
	}
	onSubmit: (data: any) => void
}

export const EventFilter: React.FC<EventFilterProps> = ({ data, onSubmit }) => {
	// Se obtiene la localización de la página para obtener los ids de los filtros
	const location = useLocation()
	const { serviceId, centerId, professionalId } = getIdsFromUrl(location)

	// Se ejecuta un efecto para seleccionar por defecto los filtros
	// Si existe alguno de estos ids en la url, se selecciona por defecto en el filtro
	useEffect(() => {
		methods.setValue("centerFilter", centerId ? Number(centerId) : undefined)
		methods.setValue("serviceFilter", serviceId ? Number(serviceId) : undefined)
		methods.setValue("professionalFilter", professionalId ? professionalId.toString() : undefined)
	}, [centerId, serviceId, professionalId])

	// Se obtienen los datos necesarios para el filtro desde el componente padre
	const { centers, services, professionals } = data
	// Estado para almacenar los profesionales que se mostrarán en el filtro
	const [selectProfessionals, setSelectProfessionals] = useState<SuperSelectField[]>([])

	const { role } = useAuth()
	const methods = useForm({})

	// Función para limpiar los filtros, onSubmit corresponde
	// a la función que se ejecutará al enviar el formulario, si el  form está vacio
	// la query será vacía y se obtendrán todos los eventos
	const handleReset = () => {
		methods.reset()
		methods.handleSubmit(onSubmit)()
	}

	// Función que se ejecuta al enviar el formulario
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		methods.handleSubmit(onSubmit)()
	}

	// Al seleccionar un servicio se filtran los profesionales
	// ya que solo se mostrarán los profesionales que ofrezcan ese servicio
	const selectedService = methods.watch("serviceFilter")

	useEffect(() => {
		if (professionals) {
			const serviceProfessionals = professionals.filter(
				(professional) => professional.serviceId === selectedService
			)
			selectDataFormatter({ data: serviceProfessionals, setData: setSelectProfessionals })
		}
	}, [selectedService])

	return (
		<section className="w-1/5 bg-white dark:bg-primary-dark p-4 flex flex-col gap-4 rounded-lg">
			<h2 className="text-xl font-bold text-dark dark:text-light">Filtrar agenda</h2>
			<FormProvider {...methods}>
				<form className="flex flex-col gap-4 pt-4" onSubmit={handleSubmit}>
					<SuperSelect label="Seleccione un centro" name="centerFilter" options={centers} />
					<Show when={role === "ADMIN"}>
						<SuperSelect label="Seleccione un servicio" name="serviceFilter" options={services} />
						<SuperSelect
							label="Seleccione un profesional"
							name="professionalFilter"
							options={selectProfessionals}
						/>
					</Show>
					<div className="w-full flex flex-col xl:flex-row gap-2 mt-1">
						<button
							className="w-full xl:w-1/2 bg-primary-dark dark:bg-gray-light text-white dark:text-dark p-2 rounded-lg border-none font-medium"
							type="button"
							onClick={handleReset}
						>
							Limpiar filtros
						</button>
						<button
							className="w-full xl:w-1/2 bg-primary text-white p-2 rounded-lg border-none font-medium"
							type="submit"
						>
							Filtrar
						</button>
					</div>
				</form>
			</FormProvider>
		</section>
	)
}
