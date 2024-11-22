import clsx from "clsx"
import React from "react"
import PageLayout from "@/layouts/PageLayout"
import DatetimeSelect from "@/components/ui/DatetimeSelect"

import { api } from "@/lib/axios"
import { Show } from "@/components/ui/Show"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Loading } from "@/components/Loading"
import { useRequest } from "@/hooks/useRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@/hooks/useMutation"
import { SuperSelect } from "@/components/ui/SuperSelect"
import { SeniorSchemas } from "@/lib/schemas"
import { message, Image } from "antd"
import { getRegisterImages } from "@/lib/actions"
import { MutateActionProps } from "@/lib/types"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form"

const SeniorRegisterRequestPage: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)
	const [images, setImages] = useState<string[]>([])

	const methods = useForm({ resolver: zodResolver(SeniorSchemas.Validate) })

	const { senior } = location.state || {}
	const { reset, handleSubmit } = methods

	useEffect(() => {
		if (!senior) navigate("/administracion/personas-mayores/nuevos")
		else {
			const defaultValues = {
				rut: senior.id,
				email: senior.email,
				birthDate: null
			}

			reset(defaultValues)
		}
	}, [senior])

	const { loading: imageLoading } = useRequest({
		action: getRegisterImages,
		params: { id: senior.id },
		onSuccess: (data) => {
			Array.isArray(data) && setImages(data)
		},
	})

	const AcceptMutation = useMutation<void>({
		mutateFn: async (params: MutateActionProps) => {
			return await api.patch(`/dashboard/seniors/${senior.id}/new?validate=true`, params.body)
		},
	})

	const DenyMutation = useMutation<void>({
		mutateFn: async () => {
			return await api.patch(`/dashboard/seniors/${senior.id}/new?validate=false`)
		},
	})

	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {

		setLoading(true)

		await AcceptMutation.mutate({
			params: { body: formData },
			onSuccess: () => {
				message.success("Solicitud aceptada")
			},
			onError: (error) => {
				message.error(error.response.data.message)
			},
		})

		setLoading(false)
		navigate("/administracion/personas-mayores/nuevos")
	}

	const onDeny = async () => {

		setLoading(true)

		await DenyMutation.mutate({
			onSuccess: () => {
				message.success("Solicitud denegada")
			},
			onError: (error) => {
				message.error(error.response.data.message)
			},
		})

		setLoading(false)
		navigate("/administracion/personas-mayores/nuevos")
	}

	return (
		<PageLayout pageTitle="Solicitud de registro de persona mayor">
			<section className={clsx(
				(loading || imageLoading) && "opacity-50",
				"bg-white dark:bg-primary-dark p-4 rounded-lg flex flex-row gap-12"
			)}>

				{(loading || imageLoading) && <Loading />}

				<FormProvider {...methods}>
					<form className="flex flex-col gap-4 w-1/3" onSubmit={handleSubmit(onSubmit)}>
						<Input
							name="rut"
							label="Rut (Sin puntos ni guión)"
							type="text"
							placeholder="Rut"
							readOnly={true}
						/>
						<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
						<Input
							name="email"
							label="Correo Electrónico"
							type="email"
							placeholder="Email"
							readOnly={true}
						/>
						<Input name="address" label="Dirección" type="text" placeholder="Dirección" />

						<div className="flex flex-row gap-4 w-full items-center justify-center">
							<div className="w-1/2">
								<SuperSelect
									name="gender"
									label="Género"
									options={[
										{ value: "MA", label: "Masculino" },
										{ value: "FE", label: "Femenino" },
									]}
								/>
							</div>
							<div className="w-1/2">
								<DatetimeSelect name="birthDate" label="Fecha de nacimiento" showTime={false} />
							</div>
						</div>

						<div className="flex flex-col gap-8">
							<p className="text-dark dark:text-light">
								<strong>Nota:</strong> Al aceptar esta solicitud, la persona mayor podrá iniciar sesión
								en la aplicación móvil, solicitar servicios y asistir a las horas de atención
								solicitadas.
							</p>

							<div className="flex gap-4">
								<Button variant="primary" type="submit">
									Aceptar
								</Button>

								<Button variant="delete" type="button" onClick={() => onDeny()}>
									Denegar
								</Button>

								<Button
									variant="secondary"
									type="button"
									onClick={() => navigate("/administracion/personas-mayores/nuevos")}
								>
									Cancelar
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>

				<div className="w-2/3 grid grid-cols-2 gap-2">
					<div className="col-span-1 grid grid-rows-2 gap-1">
						<div className="row-span-1 rounded-lg dni-container max-h-[280px] overflow-hidden">

							<Show when={!!images[0]}>
								<Image
									src={images[0]}
									alt="Cédula Frontal"
									className="object-cover object-center w-full h-full"
									fallback="/fallback.png"
								/>
							</Show>

							<Show when={!images[0]}>
								<div className="flex items-center justify-center w-full h-full">
									<p>No se ha podido cargar la imagen de la cédula frontal</p>
								</div>
							</Show>

						</div>
						<div className="row-span-1 rounded-lg dni-container max-h-[280px] overflow-hidden">

							<Show when={!!images[1]}>
								<Image
									src={images[1]}
									alt="Cédula Trasera"
									className="object-cover object-center w-full h-full"
									fallback="/fallback.png"
								/>
							</Show>

							<Show when={!images[1]}>
								<div className="flex items-center justify-center w-full h-full">
									<p>No se ha podido cargar la imagen de la cédula trasera</p>
								</div>
							</Show>

						</div>
					</div>

					<div className="col-span-1 rounded-lg dni-container overflow-hidden max-h-[580px]">

						<Show when={!!images[2]}>
							<Image
								src={images[2]}
								alt="Foto de la persona mayor"
								className="object-cover object-center w-full h-full"
								fallback="/fallback.png"
							/>
						</Show>

						<Show when={!images[2]}>
							<div className="flex items-center justify-center w-full h-full">
								<p>No se ha podido cargar la imagen de la persona mayor</p>
							</div>
						</Show>

					</div>
				</div>
			</section>
		</PageLayout>
	)
}

export default SeniorRegisterRequestPage
