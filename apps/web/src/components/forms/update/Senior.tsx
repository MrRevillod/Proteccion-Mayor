import dayjs from "dayjs"
import React from "react"
import DatetimeSelect from "../../ui/DatetimeSelect"

import { Form } from "../Form"
import { Modal } from "../../Modal"
import { Input } from "../../ui/Input"
import { useModal } from "../../../context/ModalContext"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateSenior } from "../../../lib/actions"
import { SeniorSchemas } from "../../../lib/schemas"
import { Senior, FormProps } from "../../../lib/types"
import { FormProvider, useForm } from "react-hook-form"

const UpdateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
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
		<Modal type="Edit" title={`Editar la información de ${selectedData?.name}`}>
			<FormProvider {...methods}>
				<Form<Senior> data={data as Senior[]} setData={setData} action={updateSenior} actionType="update">
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

export default UpdateSenior
