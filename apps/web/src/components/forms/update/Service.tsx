import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useModal } from "@/context/ModalContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColorPicker } from "@/components/ColorPicker"
import { updateService } from "@/lib/actions"
import { ServiceSchemas } from "@/lib/schemas"
import { ImageSelector } from "@/components/ImageSelector"
import { Service, FormProps } from "@/lib/types"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

export const UpdateService: React.FC<FormProps<Service>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const { selectedData } = useModal()

	const methods = useForm({
		resolver: zodResolver(ServiceSchemas.Update),
	})

	const { reset } = methods

	useEffect(() => {
		if (selectedData) {
			reset({
				name: selectedData.name,
				title: selectedData.title,
				description: selectedData.description,
				color: selectedData.color.toString().split("#")[1],
				minutesPerAttention: selectedData.minutesPerAttention,
			})
		}
	}, [selectedData])

	return (
		<Modal
			type="Edit"
			title={`Editar la información de ${selectedData?.name}`}
			loading={loading}
		>
			<FormProvider {...methods}>
				<Form<Service>
					data={data as Service[]}
					setData={setData}
					action={updateService}
					actionType="update"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre" type="text" placeholder="Psicología" />
					<Input name="title" label="Servicio" type="text" placeholder="Psicólogo(a)" />
					<Input
						name="description"
						label="Descripción"
						type="text"
						placeholder="¿En qué consiste el servicio?"
					/>
					<Input
						type="text"
						label="Minutos por atención"
						name="minutesPerAttention"
						maxLength={3}
						placeholder="60"
					/>
					<ColorPicker label="Color del servicio" />
					<ImageSelector imageLabel="Imagen del servicio" size={[400, 250]} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
