import dayjs from "dayjs"
import React from "react"

import { Form } from "@/components/forms/Form"
import { Modal } from "@/components/Modal"
import { Input } from "@/components/ui/Input"
import { useModal } from "@/context/ModalContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateSenior } from "@/lib/actions"
import { SeniorSchemas } from "@/lib/schemas"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"
import { Senior, FormProps } from "@/lib/types"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

export const UpdateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const { selectedData } = useModal()

	const methods = useForm({
		resolver: zodResolver(SeniorSchemas.Update),
	})

	useEffect(() => {
		if (selectedData) {
			methods.reset({
				name: selectedData.name,
				email: selectedData.email,
				address: selectedData.address,
				birthDate: dayjs(selectedData.birthDate).toISOString(),
				password: "",
				confirmPassword: "",
			})
		}
	}, [selectedData])

	return (
		<Modal type="Edit" title={`Editar la información de ${selectedData?.name}`} loading={loading}>
			<FormProvider {...methods}>
				<Form<Senior>
					data={data as Senior[]}
					setData={setData}
					action={updateSenior}
					actionType="update"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" />
					<Input name="address" label="Dirección" type="text" placeholder="Dirección" />
					<DatetimeSelect name="birthDate" label="Fecha de nacimiento" showTime={false} />
					<Input name="password" label="PIN" type="password" placeholder="••••" />
					<Input name="confirmPassword" label="Confirmar PIN" type="password" placeholder="••••" />
				</Form>
			</FormProvider>
		</Modal>
	)
}
