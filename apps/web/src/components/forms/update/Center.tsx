import React from "react"

import { Form } from "../Form"
import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { useModal } from "../../../context/ModalContext"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateCenter } from "../../../lib/actions"
import { ImageSelector } from "../../ImageSelector"
import { CentersSchemas } from "../../../lib/schemas"
import { Center, FormProps } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const UpdateCenter: React.FC<FormProps<Center>> = ({ data, setData }) => {
	const { selectedData } = useModal()

	const methods = useForm({ resolver: zodResolver(CentersSchemas.Update) })

	const { reset } = methods

	useEffect(() => {
		if (selectedData) {
			reset({
				name: selectedData.name,
				address: selectedData.address,
				phone: selectedData.phone,
				image: null,
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información del ${selectedData?.name}`}>
			<FormProvider {...methods}>
				<Form<Center> data={data as Center[]} setData={setData} action={updateCenter} actionType="update">
					<Input name="name" label="Nombre" type="text" />
					<Input name="address" label="Dirección" type="text" />
					<Input name="phone" label="Teléfono" type="text" />
					<ImageSelector imageLabel="Imagen del centro de atención" />
				</Form>
			</FormProvider>
		</Modal>
	)
}

export default UpdateCenter
