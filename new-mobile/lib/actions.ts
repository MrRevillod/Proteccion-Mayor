import { api, getContentType } from "./http"
import { MutateActionProps, QueryActionProps } from "./types"

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

export const getServices = async (props: QueryActionProps) => {
	return await apiRequest.get(`/dashboard/services/${props.query ? "?" + props.query : ""}`)
}

export const checkUniqueField = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/seniors/check-unique", props)
}

export const register = async (props: MutateActionProps) => {
	return await apiRequest.post("/dashboard/seniors/new-mobile", props)
}
