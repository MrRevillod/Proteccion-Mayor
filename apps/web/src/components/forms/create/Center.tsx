import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useState } from "react"
import { ColorPicker } from "@/components/ColorPicker"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCenter } from "@/lib/actions"
import { ImageSelector } from "@/components/ImageSelector"
import { CentersSchemas } from "@/lib/schemas"
import { Center, FormProps } from "@/lib/types"
import { FormProvider, useForm } from "react-hook-form"

export const CreateCenter: React.FC<FormProps<Center>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const methods = useForm({ resolver: zodResolver(CentersSchemas.Create) })

	return (
		<Modal type="Create" title="Añadir nuevo centro de atención al sistema" loading={loading}>
			<FormProvider {...methods}>
				<Form<Center>
					data={data as Center[]}
					setData={setData}
					action={createCenter}
					actionType="create"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre" type="text" placeholder="Centro de atención San José" />
					<Input name="address" label="Dirección" type="text" placeholder="Pedro Montt #41" />
					<Input name="phone" label="Teléfono" type="text" placeholder="56955473897" />
					<ColorPicker label="Color del centro de atención" />
					<ImageSelector imageLabel="Imagen del centro de atención" size={[400, 250]} />
				</Form>
			</FormProvider>
		</Modal>
	)
}
