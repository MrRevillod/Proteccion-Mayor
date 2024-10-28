import { Dispatch, SetStateAction } from "react"
import { Event, UserRole } from "./types"
import { Location } from "react-router-dom"
import dayjs from "dayjs"

export const formatRut = (rut: string) => {
	return rut.replace(/(\d{1,3})(\d{3})(\d{3})(\w{1})/, "$1.$2.$3-$4")
}

export const formatBoolean = (value: boolean) => {
	return value ? "Sí" : "No"
}

export const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString()
}

export const dateToAge = (dateString: string) => {
	const date = new Date(dateString)
	const ageDifMs = Date.now() - date.getTime()
	const ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export const tableColumnsFormatters = {
	id: formatRut,
	birthDate: dateToAge,
	updatedAt: formatDate,
	createdAt: formatDate,
	validated: formatBoolean,
}

export const formatRole = (role: UserRole) => {
	return role === "ADMIN" ? "Administrador" : "Profesional"
}

interface SelectDataFormatterProps {
	data: any[]
	setData: Dispatch<SetStateAction<any[]>>
	keys?: { label: string; value: string }
}

const defaultSelectKeys = { label: "name", value: "id" }

export const selectDataFormatter = ({ data, setData, keys = defaultSelectKeys }: SelectDataFormatterProps) => {
	setData(data.map((item) => ({ label: item[keys.label], value: item[keys.value] })))
}

type QueryIdsValues = {
	centerId: string | null
	serviceId: string | null
	professionalId: string | null
}

export const getIdsFromUrl = (location: Location<any>): QueryIdsValues => {
	const queryIds = {
		centerId: null,
		serviceId: null,
		professionalId: null,
	} as QueryIdsValues

	const url = new URLSearchParams(location.search)

	for (const key in queryIds) {
		const value = url.get(key)
		if (value) queryIds[key as keyof QueryIdsValues] = value
	}

	return queryIds
}

export const filterUpcomingEvents = (events: Event[]): Event[] => {
	return events.filter((event) => {
		return !event.assistance && event.seniorId !== null && dayjs(event.start).day() === dayjs().day()
	})
}
