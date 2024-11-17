import { useState } from "react"
import { MutateActionProps } from "../lib/types"

interface useMutationProps {
	mutateFn: (params: MutateActionProps) => Promise<any>
}

interface MutationOptions<T> {
	params?: MutateActionProps
	onSuccess?: (data: T) => void
	onError?: (error: any) => void
}

export const useMutation = <T,>({ mutateFn }: useMutationProps) => {

	const [loading, setLoading] = useState(false)

	const mutate = async ({ params, onSuccess, onError }: MutationOptions<T>) => {

		setLoading(true)

		try {
			const response = await mutateFn(params || {})
			if (response && response.data && response.data.values) {
				if (onSuccess) {
					onSuccess(response.data.values as T)
				}
			} else {
				throw new Error("No se encontraron datos en la respuesta")
			}
		} catch (err: any) {

			setLoading(false)

			if (onError && err.response) {
				onError(err)
			} else {
				throw new Error(err.response?.data?.message || "Error desconocido")
			}
		}
	}

	return { mutate, loading }
}
