import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColorPicker } from "@/components/ColorPicker"
import { createService } from "@/lib/actions"
import { ImageSelector } from "@/components/ImageSelector"
import { ServiceSchemas } from "@/lib/schemas"
import { FormProps, Service } from "@/lib/types"
import { FormProvider, useForm } from "react-hook-form"

export const CreateService: React.FC<FormProps<Service>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const methods = useForm({
		resolver: zodResolver(ServiceSchemas.Create),
	})

	return (
		<Modal type="Create" title="Añadir nuevo servicio al sistema" loading={loading}>
			<FormProvider {...methods}>
				<Form<Service>
					data={data as Service[]}
					setData={setData}
					action={createService}
					actionType="create"
					setLoading={setLoading}
				>
					<Input
						name="name"
						label="Nombre del Servicio"
						type="text"
						placeholder="Asesoría Legal"
					/>
					<Input
						name="title"
						label="Título del Servicio"
						type="text"
						placeholder="Abogado(a)"
					/>
					<Input
						name="description"
						label="Descripción"
						type="text"
						placeholder="Descripción breve del servicio"
					/>

					<ColorPicker label="Color del servicio" />
					<ImageSelector imageLabel="Imagen del servicio" size={[400, 250]} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
