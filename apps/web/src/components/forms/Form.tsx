import React from "react"

import { Button } from "../ui/Button"
import { useModal } from "../../context/ModalContext"
import { useMutation } from "../../hooks/useMutation"
import { ImageSelector } from "../ImageSelector"
import { message, UploadFile } from "antd"
import { buildRequestBody, handleFormError } from "../../lib/form"
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form"
import { BaseDataType, MutateAction, MutationResponse } from "../../lib/types"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"

// Form es un componente que se utiliza para crear o actualizar recursos

// data es un array de los datos que se van a modificar donde T es el tipo de dato
// setData es una función que actualiza los datos en el cliente

// El formulario recibe un action que es una función que realiza la petición al servidor
// actionType es el tipo de acción que se va a realizar, ya sea crear o actualizar
// deletable indica si el recurso es eliminable

interface FormProps<T> {
	data?: T[]
	setData?: Dispatch<SetStateAction<T[]>>
	action: MutateAction
	children: ReactNode
	actionType: "update" | "create"
	deletable?: boolean
	setLoading?: Dispatch<SetStateAction<boolean>>
	refetch?: () => void
}

// refetch es una función opcional que se utiliza para volver a obtener los datos en caso
// de que se realice alguna acción que modifique los datos
// (opcional ya que se pueden filtrar en el cliente)

export const Form = <T extends BaseDataType>({ data, setData, ...props }: FormProps<T>) => {
	const { action, children, actionType, deletable, setLoading, refetch } = props

	const { handleSubmit, reset, setError, clearErrors } = useFormContext()
	const { handleOk, handleCancel, selectedData, handleDelete } = useModal()

	const [imageFile, setImageFile] = useState<UploadFile[]>([])

	// Funciones para manejar los eventos de los botones
	// onCancel se ejecuta cuando se cancela el formulario
	const onCancel = () => {
		handleCancel()
		setImageFile([])
		clearErrors()
		reset()
	}

	// onDelete se ejecuta cuando se elimina un recurso
	const onDelete = () => {
		handleDelete()
	}

	// Se utiliza useMutation para realizar la acción
	// importante: aquí no se ejecuta la acción, solo se define
	const mutation = useMutation<MutationResponse<T>>({
		mutateFn: action,
	})

	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
		// Se construye el body a partir de los datos del formulario
		// necesario ya que el body puede contener un archivo y debe
		// estructurarse de forma diferente
		const body = buildRequestBody(formData)

		let hasChanges = false

		if (actionType === "update") {
			for (const key in formData) {
				// 1. Si existe en selectedData y es diferente a formData[key], hay cambios
				if (selectedData[key] && formData[key] !== selectedData[key]) {
					hasChanges = true
					break // Si ya hay un cambio, no es necesario seguir verificando
				}

				// 2. Si el campo no existe en selectedData pero sÃ­ en formData, hay cambios
				if (!selectedData[key] && formData[key]) {
					hasChanges = true
					break // Si ya hay un cambio, no es necesario seguir verificando
				}
			}

			// Si no se detectaron cambios
			if (!hasChanges) {
				return message.error("No se han realizado cambios")
			}
		}

		// Se realiza la acción con los datos del recurso y el body
		// onSuccess se ejecuta si la acción se realiza correctamente
		// onError se ejecuta si ocurre un error

		setLoading && setLoading(true)

		await mutation.mutate({
			params: { id: selectedData?.id || null, body },
			onSuccess: (res) => {
				// Diferenciamos si se va a refetchear o no
				// Si no se refetchea, se actualiza el estado con los datos manualmente
				if (!refetch && data && setData) {
					// El campo modified contiene los datos actualizados / creados
					if (!res.modified) {
						return message.error("Error al guardar. Intente nuevamente o recargue la página.")
					}

					// Dependiendo del tipo de acción, se actualiza o se crea un nuevo
					// desde el estado local en el cliente

					if (actionType === "update") {
						const { modified: updated, image } = res
						const index = data.findIndex((entity) => entity.id === updated?.id)

						if (index !== -1) {
							const updatedData = [...data]
							updatedData[index] = { ...updated, image }
							setData(updatedData)
						}
					} else if (actionType === "create") {
						setData([res.modified, ...data])
					}
				}

				// De lo contrario, si existe la función refetch, se ejecuta
				// y se actualizan los datos desde el servidor

				refetch && refetch()
				setLoading && setLoading(false)

				message.success("Hecho")
				setImageFile([])
				handleOk()
				reset()
			},
			onError: (error) => {
				setLoading && setLoading(false)
				handleFormError(error, setError)
			},
		})
	}

	return (
		<form
			className="flex flex-col gap-4 py-6 bg-light dark:bg-primary-dark rounded-lg"
			onSubmit={handleSubmit(onSubmit)}
		>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child) && child.type === ImageSelector) {
					return React.cloneElement(child, { imageFile, setImageFile } as any)
				}
				return child
			})}
			<div className="flex flex-row gap-4 w-full justify-end -mb-6">
				{deletable && (
					<Button type="button" className="justify" variant="delete" onClick={onDelete}>
						Eliminar
					</Button>
				)}
				<Button type="button" variant="secondary" onClick={onCancel}>
					Cancelar
				</Button>

				<Button type="submit" variant="primary">
					Guardar
				</Button>
			</div>
		</form>
	)
}
