import React from "react"
import RenderPageError from "@/layouts/PageErrorLayout"

import { Helmet } from "react-helmet"
import { message } from "antd"
import { jwtDecode } from "jwt-decode"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FormProvider, useForm, SubmitHandler } from "react-hook-form"

import { api } from "@/lib/axios"
import { UserRole } from "@/lib/types"
import { resetPasswordSchema } from "@/lib/schemas"

import { Show } from "@/components/ui/Show"
import { Input } from "@/components/ui/Input"
import { Loading } from "@/components/Loading"

interface ResetPasswordFormData {
	password: string
	confirmPassword: string
}

const ValidatePasswordPage: React.FC = () => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const { id, token, role } = useParams()

	if (!role || !id || !token) {
		return <RenderPageError title="Error - Enlace inválido" />
	}

	useEffect(() => {
		setLoading(true)

		api.get(`/auth/account/reset-password/${id}/${token}/${role}`)
			.then(() => setError(false))
			.catch(() => {
				setError(true)
				setErrorMessage("Error 404 - Enlace inválido")
			})
			.finally(() => setLoading(false))
	}, [id, token, role])

	const payload = jwtDecode<{ role: string }>(role as string)
	const validationSchema = resetPasswordSchema(payload.role as UserRole | "SENIOR")

	const methods = useForm<ResetPasswordFormData>({
		resolver: zodResolver(validationSchema),
	})

	const { handleSubmit, reset } = methods

	const onSubmit: SubmitHandler<ResetPasswordFormData> = async (formData) => {
		try {
			const response = await api.post(`/auth/account/reset-password/${id}/${token}/${role}`, {
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			})

			message.success(response.data.message)
			navigate("/auth/iniciar-sesion")
			reset()
		} catch (error: any) {
			if (error.response.status === 409) {
				setErrorMessage("La contraseña no puede ser igual a la anterior")
				return
			}
			message.error(error.response?.data?.message || "Error inesperado")
		}
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>Restablecer contraseña - Dirección de personas mayores de Temuco</title>
			</Helmet>

			<Show when={error}>
				<RenderPageError title={errorMessage} />
			</Show>

			<Show when={loading}>
				<Loading />
			</Show>

			<Show when={error === false && loading !== true}>
				<div className="flex w-full login-container items-center justify-center absolute">
					<div className="bg-white dark:bg-primary-dark flex flex-col justify-center items-center px-8 md:px-12 w-11/12 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:1/3 2xl:w-1/4 rounded-lg h-2/3 min-h-[550px] login-form-container dark:shadow-none">
						<div className="w-full max-w-md">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
								Restablecer Contraseña
							</h2>
							<p className="text-center text-gray-600 mb-6">Ingresa y confirma tu nueva contraseña.</p>

							{errorMessage && <p className="text-red text-center mb-4">{errorMessage}</p>}

							<FormProvider {...methods}>
								<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
									<Input
										name="password"
										label={payload.role === "SENIOR" ? "Nuevo PIN" : "Nueva Contraseña"}
										type="password"
										placeholder={`Ingresa tu ${payload.role === "SENIOR" ? "nuevo PIN" : "nueva contraseña"}`}
										maxLength={payload.role === "SENIOR" ? 4 : 100}
									/>

									<Input
										name="confirmPassword"
										label={
											payload.role === "SENIOR"
												? "Confirma tu nuevo PIN"
												: "Confirma tu nueva Contraseña"
										}
										type="password"
										placeholder={`Confirma tu ${payload.role === "SENIOR" ? "nuevo PIN" : "nueva contraseña"}`}
										maxLength={payload.role === "SENIOR" ? 4 : 100}
									/>

									<div className="mt-4">
										<button
											type="submit"
											className="bg-green-800 text-neutral-100 rounded-lg p-2 w-full h-12 font-bold"
										>
											{payload.role === "SENIOR" ? "Restablecer PIN" : "Restablecer Contraseña"}
										</button>
									</div>
								</form>
							</FormProvider>
						</div>
					</div>
				</div>
			</Show>
		</React.Fragment>
	)
}

export default ValidatePasswordPage
