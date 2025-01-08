import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useModal } from "@/context/ModalContext"
import { ColorPicker } from "@/components/ColorPicker"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateCenter } from "@/lib/actions"
import { ImageSelector } from "@/components/ImageSelector"
import { CentersSchemas } from "@/lib/schemas"
import { Center, FormProps } from "@/lib/types"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

export const UpdateCenter: React.FC<FormProps<Center>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const methods = useForm({ resolver: zodResolver(CentersSchemas.Update) })

	const { reset } = methods
	const { selectedData } = useModal()

	useEffect(() => {
		if (selectedData) {
			reset({
				name: selectedData.name,
				address: selectedData.address,
				phone: selectedData.phone,
				image: null,
				color: selectedData.color,
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información del ${selectedData?.name}`} loading={loading}>
			<FormProvider {...methods}>
				<Form<Center>
					data={data as Center[]}
					setData={setData}
					action={updateCenter}
					actionType="update"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre" type="text" />
					<Input name="address" label="Dirección" type="text" />
					<Input name="phone" label="Teléfono" type="text" />
					<ColorPicker label="Color del centro de atención" />
					<ImageSelector imageLabel="Imagen del centro de atención" size={[400, 250]} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
