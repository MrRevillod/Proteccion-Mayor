import React, { useState } from "react"

import { Form } from "@/components/forms/Form"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { useAuth } from "@/context/AuthContext"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"

import { useModal } from "@/context/ModalContext"
import { useRequest } from "@/hooks/useRequest"
import { SeniorSchemas } from "@/lib/schemas"
import { selectDataFormatter } from "@/lib/formatters"
import { FormProvider, useForm } from "react-hook-form"
import { createSenior, getSectors } from "@/lib/actions"
import { FormProps, Sector, Senior, SuperSelectField } from "@/lib/types"

export const CreateSenior: React.FC<FormProps<Senior>> = ({ data, setData }) => {
	const [loading, setLoading] = useState(false)
	const [sectors, setSectors] = useState<SuperSelectField[]>([])

	const { user } = useAuth()
	const { modalType, isModalOpen } = useModal()

	const methods = useForm({
		resolver: zodResolver(SeniorSchemas.DashboardRegister),
		defaultValues: {
			registeredBy: user?.id,
		},
	})

	useRequest<Sector[]>({
		action: getSectors,
		query: "select=id,name",
		trigger: isModalOpen && modalType === "Create",
		onSuccess: (data) => {
			selectDataFormatter({ data, setData: setSectors })
		},
	})

	return (
		<Modal type="Create" title="Añadir nueva persona mayor al sistema" loading={loading}>
			<p>
				<strong>Nota: </strong>El sistema guardará la información del funcionario municipal que está registrando
				a una nueva persona mayor.
			</p>

			<FormProvider {...methods}>
				<Form<Senior>
					data={data as Senior[]}
					setData={setData}
					action={createSenior}
					actionType="create"
					setLoading={setLoading}
				>
					<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" />
					<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" />

					<div className="flex flex-row gap-4 w-full items-center justify-between">
						<div className="w-1/2">
							<Input
								name="email"
								label="Correo Electrónico"
								type="email"
								placeholder="JohnD@provider.com"
							/>
						</div>

						<div className="w-1/2">
							<SuperSelect
								name="gender"
								label="Género"
								showSearch={false}
								options={[
									{ value: "MA", label: "Masculino" },
									{ value: "FE", label: "Femenino" },
								]}
							/>
						</div>
					</div>

					<div className="flex flex-row gap-4 w-full items-center justify-between">
						<div className="w-1/2">
							<Input name="phone" label="Teléfono" type="text" placeholder="955473897" />
						</div>
						<div className="w-1/2">
							<Input
								name="rsh"
								label="Registro social de hogares"
								type="text"
								maxLength={3}
								placeholder="60"
							/>
						</div>
					</div>

					<div className="flex flex-row gap-4 w-full items-center justify-between">
						<div className="w-1/2">
							<DatetimeSelect label="Fecha de nacimiento" name="birthDate" showTime={false} />
						</div>
						<div className="w-1/2">
							<Input name="address" label="Dirección" type="text" placeholder="Montt #123" />
						</div>
					</div>
					<SuperSelect
						name="sectorId"
						label="Selecciona el sector de residencia o atención"
						options={sectors}
						placeholder="Sector centro"
						allowClear
					/>

					<div className="hidden">
						<Input name="registeredBy" label="Registrado por" type="text" readOnly />
					</div>
				</Form>
			</FormProvider>
		</Modal>
	)
}
