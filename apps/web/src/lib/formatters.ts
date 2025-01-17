import dayjs from "dayjs"

import { Location } from "react-router-dom"
import { Event, StaffRole, UserRole } from "./types"
import { Dispatch, SetStateAction } from "react"

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




export const formatStaffRole = (role: StaffRole) => {
    return role === "ADMIN" ? "Administrador" : "Funcionario"
}

export const tableColumnsFormatters = {
	id: formatRut,
	birthDate: dateToAge,
	updatedAt: formatDate,
	createdAt: formatDate,
    validated: formatBoolean,
    role: formatStaffRole,
}

export const formatRole = (role: UserRole) => {
	return role === "ADMIN" ? "Administrador" : ( role === "FUNCTIONARY" ? "Funcionario de apoyo": "Profesional")
}

interface SelectDataFormatterProps {
	data: any[]
	setData: Dispatch<SetStateAction<any[]>>
    keys?: { label: string; value: string }
    allString?: boolean
}

const defaultSelectKeys = { label: "name", value: "id" }

export const selectDataFormatter = ({ data, setData, keys = defaultSelectKeys, allString = false }: SelectDataFormatterProps) => {
    if (allString) {
        setData(data.map((item) => ({ label: item[keys.label].toString(), value: item[keys.value].toString() })))
    } else {
        setData(data.map((item) =>  ({ label: item[keys.label], value: item[keys.value] })))
    }
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
		return (
			!event.assistance &&
			event.seniorId !== null &&
			dayjs(event.start).isSame(dayjs(), "day") &&
			dayjs(event.start).isAfter(dayjs())
		)
	})
}

export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const generateYears = () => {
	const INIT_YEAR_VALUE = import.meta.env.VITE_CALENDAR_YEAR_START
	const yearDiff = new Date().getFullYear() - Number(INIT_YEAR_VALUE)
	const years = [] as any[]

	for (let i = 0; i <= yearDiff; i++) {
		years.push({ label: `${Number(INIT_YEAR_VALUE) + i}`, value: `${Number(INIT_YEAR_VALUE) + i}` })
	}

	return years
}

export const generateMonths = () => {
	const months = [] as any[]

	for (let i = 1; i <= 12; i++) {
		const month = {
			label: capitalize(
				dayjs()
					.month(i - 1)
					.format("MMMM"),
			),
			value: i,
		}
		months.push(month)
	}

	return months
}

export const abbreviateCenterName = (name: string) => {
	const words = name.split(" ")
	return words.length > 1 ? words.map((word) => word[0]).join("") : words[0]
}
