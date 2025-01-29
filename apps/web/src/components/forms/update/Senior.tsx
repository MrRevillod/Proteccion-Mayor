import dayjs from "dayjs"
import React from "react"

import { Form } from "@/components/forms/Form"
import { Modal } from "@/components/Modal"
import { Input } from "@/components/ui/Input"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"

import { useModal } from "@/context/ModalContext"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { useRequest } from "@/hooks/useRequest"
import { SeniorSchemas } from "@/lib/schemas"
import { selectDataFormatter } from "@/lib/formatters"
import { getSectors, updateSenior } from "@/lib/actions"
import { Senior, FormProps, Sector, SuperSelectField } from "@/lib/types"

export const UpdateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const [sectors, setSectors] = useState<SuperSelectField[]>([])

	const methods = useForm({
		resolver: zodResolver(SeniorSchemas.Update),
	})

	const { selectedData, modalType, isModalOpen } = useModal()

	useRequest<Sector[]>({
		action: getSectors,
		query: "select=id,name",
		trigger: isModalOpen && modalType === "Edit",
		onSuccess: (data) => {
			selectDataFormatter({ data, setData: setSectors })
		},
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
				phone: selectedData.phone,
				rsh: selectedData.rsh,
				sectorId: Number(selectedData.sectorId),
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

					<div className="flex flex-row gap-4 w-full items-center justify-between">
						<div className="w-1/2">
							<DatetimeSelect name="birthDate" label="Fecha de nacimiento" showTime={false} />
						</div>
						<div className="w-1/2">
							<Input name="phone" label="Teléfono" type="text" placeholder="Teléfono" />
						</div>
					</div>

					<div className="flex flex-row gap-4 w-full items-center justify-between">
						<div className="w-1/2">
							<Input name="address" label="Dirección" type="text" placeholder="Dirección" />
						</div>
						<div className="w-1/2">
							<SuperSelect
								name="sectorId"
								label="Selecciona el sector de residencia"
								options={sectors}
								placeholder="Sector centro"
								allowClear
							/>
						</div>
					</div>
					<Input name="rsh" label="Registro social de hogares" type="text" placeholder="60" />

					<div className="flex flex-row gap-4 w-full items-center justify-between">
						<div className="w-1/2">
							<Input name="password" label="PIN" type="password" placeholder="••••" />
						</div>
						<div className="w-1/2">
							<Input name="confirmPassword" label="Confirmar PIN" type="password" placeholder="••••" />
						</div>
					</div>
				</Form>
			</FormProvider>
		</Modal>
	)
}
