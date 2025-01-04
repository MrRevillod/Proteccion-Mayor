import { api, getContentType } from "./http"
import { MutateActionProps, QueryActionProps } from "./types"

const apiRequest = {
	get: async (url: string) => {
		return await api.get(url)
	},
	post: async (url: string, opts: MutateActionProps) => {
		return await api.post(url, opts.body, {
			headers: {
				"Content-Type": getContentType(opts.body),
			},
		})
	},
	patch: async (url: string, opts: MutateActionProps) => {
		return await api.patch(`${url}`, opts.body, {
			headers: {
				"Content-Type": getContentType(opts.body),
			},
		})
	},
	delete: async (url: string, opts: MutateActionProps) => {
		return await api.delete(`${url}`)
	},
}

export const getProfilePicture = async (props: QueryActionProps) => {
	return await apiRequest.get(`/storage/public/seniors/${props.params?.id}/profile.webp`)
}

export const getServices = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/services${props.query ? "?" + props.query : ""}`)
}

export const checkUniqueField = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/seniors/check-unique", props)
}

export const register = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/seniors/new-mobile", props)
}

export const getCentersByService = async (props: QueryActionProps) => {
	return await apiRequest.get(
		`/dashboard/events/available-centers/${props.params?.serviceId ?? "0"}`,
	)
}

export const getAvailableDates = async (props: QueryActionProps) => {
	return await apiRequest.get(
		`/dashboard/events/available-dates${props.query ? "?" + props.query : ""}`,
	)
}

export const getEvents = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/events${props.query ? "?" + props.query : ""}`)
}

export const getEventsByDate = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/events/by-date${props.query ? "?" + props.query : ""}`)
}

export const reservateEvent = async (props: MutateActionProps) => {
	return await apiRequest.patch(`/dashboard/events/${props.id}/reservate`, props)
}

export const cancelReservation = async (props: MutateActionProps) => {
	return await apiRequest.patch(`/dashboard/events/${props.id}/cancel`, props)
}

export const updateUser = async (props: MutateActionProps) => {
	return await apiRequest.patch(`/dashboard/seniors/${props.id}`, props)
}

export const deleteAccount = async (props: MutateActionProps) => {
	return await apiRequest.delete(`/dashboard/seniors/${props.id}`, props)
}
