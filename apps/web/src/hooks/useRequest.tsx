import { ApiError, QueryAction } from "@/lib/types"
import { useEffect, useState, useRef } from "react"

/**
 * useRequestProps es una interfaz que define los datos que recibe useRequest
 * @template T Tipo de dato que retorna la petición
 * @param action Función que realiza la petición GET al servidor
 * @param query Cadena de texto que se envía en la petición GET (selectores y filtros)
 * @param onSuccess Función que se ejecuta cuando la petición es exitosa
 * @param trigger Booleano que
 */

interface useRequestProps<T> {
	action: QueryAction
	query?: string
	params?: Record<string, any>
	onSuccess?: (data: T) => void
	onError?: (error: ApiError) => void
	trigger?: boolean
}

/**
 * useRequestResult es una interfaz que define los datos que retorna useRequest
 * @template T Tipo de dato que retorna la petición
 * @param data Datos obtenidos de la petición
 * @param loading Booleano que indica si la petición está en curso
 * @param error Error obtenido de la petición
 * @param status Código de estado de la petición
 * @param refetch Función que ejecuta la petición
 * @returns {useRequestResult} Objeto con los datos de la petición
 */

interface useRequestResult<T> {
	data: T | null
	loading: boolean
	error: ApiError
	status: number
	refetch: () => void
}

/**
 * Hook para realizar peticiones al servidor
 * @function useRequest
 * @param action Función de tipo axios que realiza la petición GET al servidor
 * @param query Cadena de texto que se envía en la petición GET (selectores y filtros)
 * @param onSuccess Función que se ejecuta cuando la petición es exitosa
 * @param trigger Booleano que indica si se debe ejecutar la petición al montar el componente
 *
 * @returns {useRequestResult} Objeto con los datos de la petición
 *
 * @example
 * const { data, loading, error, status, refetch } = useRequest<Products[]>({
 * 		action: getProducts,
 * 		query: "limit=10",
 * 		onSuccess: (data) => console.log(data),
 * })
 */

export const useRequest = <T,>({ action, ...props }: useRequestProps<T>): useRequestResult<T> => {
	const { params, query, onSuccess, onError, trigger = true } = props

	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<ApiError>(null)
	const [status, setStatus] = useState<number>(200)

	// useRef para almacenar la función fetchData
	// se utiliza para poder llamar a fetchData desde afuera
	// es importante utilizar una ref para que el valor de la función
	// no cambie en cada renderizado, un estado no sería adecuado

	const fetchDataRef = useRef<() => void>(() => {})

	const fetchData = async () => {
		try {
			setLoading(true)
			const response = await action({ params, query })
			setData(response.data.values as T)
			setError(null)
			setStatus(response.status)

			if (onSuccess) onSuccess(response.data.values as T)
		} catch (err: any) {
			if (err.response?.data) {
				setStatus(err.response?.status)
				setError(err.response?.data?.message || "Error desconocido")
			}
			if (onError) onError(err.response?.data)
		} finally {
			setLoading(false)
		}
	}

	// Almacenar la función fetchData en fetchDataRef
	fetchDataRef.current = fetchData

	// useEffect para ejecutar fetchData si trigger es true
	// por defecto trigger es true, entonces al definirse en las props
	// permite crear un mecanismo para ejecutar la petición condicionalmente

	useEffect(() => {
		if (!trigger) return
		fetchData()
	}, [action, query, trigger])

	return { data, loading, error, status, refetch: fetchDataRef.current }
}
