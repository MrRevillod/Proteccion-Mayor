import React from "react"

import { Form } from "../Form"
import { Input } from "../../ui/Input"
import { Modal } from "../../Modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColorPicker } from "../../ColorPicker"
import { createService } from "../../../lib/actions"
import { ImageSelector } from "../../ImageSelector"
import { ServiceSchemas } from "../../../lib/schemas"
import { FormProps, Service } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const CreateService: React.FC<FormProps<Service>> = ({ data, setData }) => {
	const methods = useForm({
		resolver: zodResolver(ServiceSchemas.Create),
	})

	return (
		<Modal type="Create" title="Añadir nuevo servicio al sistema">
			<FormProvider {...methods}>
				<Form<Service> data={data as Service[]} setData={setData} action={createService} actionType="create">
					<Input name="name" label="Nombre del Servicio" type="text" placeholder="Asesoría Legal" />
					<Input name="title" label="Título del Servicio" type="text" placeholder="Abogado(a)" />
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

export default CreateService
