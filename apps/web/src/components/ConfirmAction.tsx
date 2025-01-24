import React from "react"

import { api } from "@/lib/axios"
import { Show } from "./ui/Show"
import { Modal } from "./Modal"
import { Input } from "./ui/Input"
import { Button } from "./ui/Button"
import { message } from "antd"
import { useModal } from "../context/ModalContext"
import { useMutation } from "../hooks/useMutation"
import { FormProvider, useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { MutateAction, BaseDataType, MutationResponse } from "../lib/types"

interface ConfirmActionProps<T> {
	text: string
	data?: T | T[]
	setData?: Dispatch<SetStateAction<T | null>> | Dispatch<SetStateAction<T[]>>
	action: MutateAction
	requirePasswordConfirmation?: boolean
	refetch?: () => void
}

export const ConfirmAction = <T extends BaseDataType>({ text, ...props }: ConfirmActionProps<T>) => {
	const { data, setData, action, refetch, requirePasswordConfirmation } = props
	const { handleOk, handleCancel, selectedData } = useModal()

	const methods = useForm()
	const mutation = useMutation<MutationResponse<T>>({
		mutateFn: action,
	})

	const handleConfirm = async () => {
		try {
			if (requirePasswordConfirmation) {
				const { password } = methods.getValues()

				if (!password) return message.error("Por favor, ingrese su contraseña")
				await api.post("/dashboard/staff/confirm-action", { password })
			}

			await mutation.mutate({
				params: { id: selectedData?.id || null },
				onSuccess: (res) => {
					if (!refetch && data && setData) {
						const { modified: deleted } = res

						if (!deleted) {
							return message.error("Error al guardar. Intente nuevamente o recargue la página.")
						}

						if (Array.isArray(data)) {
							const setter = setData as Dispatch<SetStateAction<T[]>>
							setter(data.filter((element) => element.id !== deleted.id))
						} else {
							const setter = setData as Dispatch<SetStateAction<T | null>>
							setter(null)
						}
					}

					refetch && refetch()
					methods.reset()
					message.success("Hecho")
					handleOk()
				},
				onError: () => {
					message.error("Error al eliminar el registro")
					handleCancel()
				},
			})
		} catch (error) {
			message.error("Error al confirmar la acción, revise la contraseña o intente nuevamente")
		}
	}

	return (
		<Modal title="Confirmar acción" type="Confirm">
			<div className="mt-12 flex flex-col gap-8 justify-center items-center">
				<h2 className="text-lg font-light text-center">
					{text} - {requirePasswordConfirmation ? "Se requiere confirmación de contraseña" : ""}
				</h2>

				<Show when={!!requirePasswordConfirmation}>
					<FormProvider {...methods}>
						<div className="w-full flex items-center justify-center -mt-4">
							<form className="flex flex-col gap-4 w-2/3">
								<Input
									type="password"
									placeholder="Ingrese su contraseña"
									name="password"
									login={false}
									label=""
								/>
							</form>
						</div>
					</FormProvider>
				</Show>

				<div className="flex flex-row gap-4 w-full justify-center">
					<Button type="button" variant="secondary" className="w-1/4" onClick={() => handleCancel()}>
						Cancelar
					</Button>

					<Button onClick={() => handleConfirm()} variant="primary" className="w-1/4">
						Confirmar
					</Button>
				</div>
			</div>
		</Modal>
	)
}
