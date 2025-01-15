import React from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useModal } from "@/context/ModalContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { getCenters, updateStaff } from "@/lib/actions"
import { useEffect, useState } from "react"
import { StaffSchemas } from "@/lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { Staff, FormProps, StaffRole, Center } from "@/lib/types"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { useRequest } from "@/hooks/useRequest"
import { selectDataFormatter } from "@/lib/formatters"
import { message } from "antd"

export const UpdateStaff: React.FC<FormProps<Staff>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
    const [centers, setCenters] = useState<Center[]>([])

	const methods = useForm({
		resolver: zodResolver(StaffSchemas.Update),
	})

	const { reset } = methods
	const { selectedData } = useModal()

    useEffect(() => {
        console.log(selectedData)
		if (selectedData) {
			reset({
				name: selectedData.name,
                email: selectedData.email,
                role: selectedData.role,
                centerId: selectedData.centerId,
			})
		}
	}, [selectedData])

    const { error } = useRequest<Center[]>({
		action: getCenters,
		onSuccess: (centers) => selectDataFormatter({ data: centers, setData: setCenters }),
	})

	if (error) message.error("Error al cargar los datos")
	return (
		<Modal type="Edit" title={`Editar la información de ${selectedData?.name}`} loading={loading}>
			<FormProvider {...methods}>
				<Form<Staff>
					data={data as Staff[]}
					setData={setData}
					action={updateStaff}
					actionType="update"
					setLoading={setLoading}
				>
					<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
					<Input name="email" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" />
					<Input name="password" label="Contraseña" type="password" placeholder="••••" />
					<Input  name="confirmPassword" label="Confirmar contraseña" type="password" placeholder="••••" />
                    <SuperSelect
                        name="role"
                        label="Rol"
                        options={[{ label: "Administrador", value: "ADMIN" }, { label: "Funcionario", value: "FUNCTIONARY" }]}
                        placeholder="Escoja un rol"
                    />
                    <SuperSelect
                        name="centerId" label="Centro"
                        options={centers} placeholder="Escoja un centro para el funcionario"
                    />
				</Form>
			</FormProvider>
		</Modal>
	)
}
