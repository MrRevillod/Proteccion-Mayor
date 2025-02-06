import React, { useState } from "react"
import { message } from "antd"

import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/Button"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageSelector } from "@/components/ImageSelector"
import { DatetimeSelect } from "@/components/ui/DatetimeSelect"

import { useModal } from "@/context/ModalContext"
import { useRequest } from "@/hooks/useRequest"
import { useMutation } from "@/hooks/useMutation"
import { SeniorSchemas } from "@/lib/schemas"
import { handleFormError } from "@/lib/form"
import { selectDataFormatter } from "@/lib/formatters"
import { FormProvider, useForm } from "react-hook-form"
import { createSenior, getSectors } from "@/lib/actions"
import { FormProps, RSH, Sector, Senior, SuperSelectField } from "@/lib/types"

export const CreateSenior: React.FC<FormProps<Senior>> = ({ refetch }) => {
	const [loading, setLoading] = useState(false)
	const [sectors, setSectors] = useState<SuperSelectField[]>([])

	const { modalType, isModalOpen, handleOk, handleCancel } = useModal()

	const methods = useForm({
		resolver: zodResolver(SeniorSchemas.DashboardRegister),
	})

	useRequest<Sector[]>({
		action: getSectors,
		query: "select=id,name",
		trigger: isModalOpen && modalType === "Create",
		onSuccess: (data) => {
			selectDataFormatter({ data, setData: setSectors })
		},
	})

	const onCancel = () => {
		handleCancel()
		methods.clearErrors()
		methods.reset()
	}

	const mutation = useMutation({ mutateFn: createSenior })

	const onSubmit = async (data: any) => {

		setLoading(true)

		try {
			const formattedBody = new FormData()

			formattedBody.append("id", data.id)
			formattedBody.append("name", data.name)
			formattedBody.append("email", data.email)
			formattedBody.append("gender", data.gender)
			formattedBody.append("phone", data.phone)
			formattedBody.append("rsh", data.rsh)
			formattedBody.append("birthDate", data.birthDate)
			formattedBody.append("address", data.address)
			formattedBody.append("sectorId", data.sectorId)

			formattedBody.append("dni-a", data["dni-a"], "dni-a")
			formattedBody.append("dni-b", data["dni-b"], "dni-b")
			formattedBody.append("social", data.social, "social")

			await mutation.mutate({
				params: { body: formattedBody },
				onError: (error) => handleFormError(error, methods.setError)
			})

			refetch && refetch()

			message.success("Hecho")
			methods.clearErrors()
			methods.setValue("dni-a", null)
			methods.setValue("dni-b", null)
			methods.setValue("social", null)

			handleOk()
			methods.reset()

		} catch (error) {
			message.error("Error. Intente nuevamente.")
		}

		setLoading(false)
	}

	return (
		<Modal type="Create" title="Añadir nueva persona mayor al sistema" loading={loading} size="large">
			<p>
				<strong>Nota: </strong>El sistema guardará la información del funcionario municipal que está registrando
				a una nueva persona mayor.
			</p>

			<FormProvider {...methods}>

				<div className="flex flex-col gap-2 w-full pb-6">

					<form
						className="flex flex-row gap-8 py-6 bg-light dark:bg-primary-dark rounded-lg"
						onSubmit={methods.handleSubmit(onSubmit)}
					>

						<div className="flex flex-col gap-4 w-1/2">

							<Input name="id" label="Rut (sin puntos ni guión)" type="text" placeholder="123456789" errorAlign="vertical" />
							<Input name="name" label="Nombre" type="text" placeholder="Juan Perez" errorAlign="vertical" />

							<div className="flex flex-row gap-4 w-full items-center justify-between">
								<div className="w-1/2">
									<Input
										name="email"
										label="Correo Electrónico"
										type="email"
										placeholder="JohnD@provider.com"
										errorAlign="vertical"
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
											{ value: "OTHERS", label: "Otro" },
										]}
										errorAlign="vertical"
									/>
								</div>
							</div>

							<div className="flex flex-row gap-4 w-full items-center justify-between">
								<div className="w-1/2">
									<Input name="phone" label="Teléfono" type="text" placeholder="955473897" errorAlign="vertical" />
								</div>
								<div className="w-1/2">
									<Input name="address" label="Dirección" type="text" placeholder="Montt #123" errorAlign="vertical" />
								</div>
							</div>

							<DatetimeSelect label="Fecha de nacimiento" name="birthDate" showTime={false} errorAlign="vertical" />

						</div>

						<div className="w-1/2 flex flex-col gap-4">

							<SuperSelect
								name="sectorId"
								label="Selecciona el sector de residencia o atención"
								options={sectors}
								placeholder="Sector centro"
								allowClear
								errorAlign="vertical"
							/>
							<SuperSelect
								name="rsh"
								label="Tramo de registro social de hogares"
								showSearch={false}
								errorAlign="vertical"
								options={Object.keys(RSH).map((key) => ({ value: key, label: RSH[key] }))}
							/>

							<ImageSelector size={[480, 300]} imageLabel="Cédula de identidad (lado delantero)" name="dni-a" />
							<ImageSelector size={[400, 253]} imageLabel="Cédula de identidad (lado trasero)" name="dni-b" />
							<ImageSelector size={[400, 400]} imageLabel="Registro social de hogares" name="social" />

						</div>

					</form>

					<div className="flex flex-row gap-4 w-full justify-end -mb-6">
						<Button type="button" variant="secondary" onClick={() => onCancel()}>
							Cancelar
						</Button>
						<Button type="submit" variant="primary" onClick={methods.handleSubmit(onSubmit)}>
							Guardar
						</Button>
					</div>
				</div>

			</FormProvider>
		</Modal >
	)
}
