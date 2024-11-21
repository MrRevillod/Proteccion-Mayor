import { api } from "./axios"
import { getContentType } from "./form"
import { MutateActionProps, QueryActionProps } from "./types"

// Funciones auxiliares para las operaciones CRUD

const apiRequest = {
	get: async (url: string) => {
		return await api.get(url)
	},
	post: async (url: string, opts: MutateActionProps) => {
		return await api.post(url, opts.body)
	},
	patch: async (url: string, opts: MutateActionProps) => {
		return await api.patch(`${url}/${opts.id}`, opts.body, {
			headers: {
				"Content-Type": getContentType(opts.body),
			},
		})
	},
	delete: async (url: string, opts: MutateActionProps) => {
		return await api.delete(`${url}/${opts.id}`)
	},
}

// Acciones CRUD para los administradores

export const getAdministrators = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/administrators${props.query ? "?" + props.query : ""}`)
}

export const createAdministrator = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/administrators", props)
}

export const updateAdministrator = async (props: MutateActionProps) => {
	return await apiRequest.patch("/dashboard/administrators", props)
}

export const deleteAdministrator = async (props: MutateActionProps) => {
	return await apiRequest.delete("/dashboard/administrators", props)
}

// Acciones CRUD para los profesionales

export const getProfessionals = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/professionals${props.query ? "?" + props.query : ""}`)
}

export const getOneProfessional = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/professionals/unique${props.query ? "?" + props.query : ""}`)
}

export const createProfessional = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/professionals", props)
}

export const updateProfessional = async (props: MutateActionProps) => {
	return await apiRequest.patch("/dashboard/professionals", props)
}

export const deleteProfessional = async (props: MutateActionProps) => {
	return await apiRequest.delete("/dashboard/professionals", props)
}

// Acciones CRUD para las personas mayores

export const getSeniors = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/seniors${props.query ? "?" + props.query : ""}`)
}

export const getNewSeniors = async () => {
	return await apiRequest.get("/dashboard/seniors/new")
}

export const createSenior = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/seniors/pre-checked", props)
}

export const updateSenior = async (props: MutateActionProps) => {
	return await apiRequest.patch("/dashboard/seniors", props)
}

export const deleteSenior = async (props: MutateActionProps) => {
	return await apiRequest.delete("/dashboard/seniors", props)
}

// Acciones CRUD para los centros

export const getCenters = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/centers${props.query ? "?" + props.query : ""}`)
}

export const createCenter = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/centers", props)
}

export const updateCenter = async (props: MutateActionProps) => {
	return await apiRequest.patch("/dashboard/centers", props)
}

export const deleteCenter = async (props: MutateActionProps) => {
	return await apiRequest.delete("/dashboard/centers", props)
}

// Acciones CRUD para los servicios

export const getServices = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/services${props.query ? "?" + props.query : ""}`)
}

export const createService = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/services", props)
}

export const updateService = async (props: MutateActionProps) => {
	return await apiRequest.patch("/dashboard/services", props)
}

export const deleteService = async (props: MutateActionProps) => {
	return await apiRequest.delete("/dashboard/services", props)
}

// Acciones CRUD para los eventos

export const getEvents = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/events${props.query ? "?" + props.query : ""}`)
}

export const createEvent = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/events", props)
}

export const updateEvent = async (props: MutateActionProps) => {
	return await apiRequest.patch("/dashboard/events", props)
}

export const deleteEvent = async (props: MutateActionProps) => {
	return await apiRequest.delete("/dashboard/events", props)
}

export const getReports = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/reports${props.query ? "?" + props.query : ""}`)
}

export const getRegisterImages = async (props: QueryActionProps) => {
	return await apiRequest.get(`/storage/public/seniors/${props?.params?.id}/register-files`)
}
