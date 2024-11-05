import { api } from "../../lib/axios"
import { Show } from "@/components/ui/Show"
import { Input } from "../../components/ui/Input"
import { Helmet } from "react-helmet"
import { message } from "antd"
import { jwtDecode } from "jwt-decode"
import { zodResolver } from "@hookform/resolvers/zod"
import RenderPageError from "@/layouts/PageErrorLayout"
import { useParams, useNavigate } from "react-router-dom"
import { resetPasswordSchema } from "../../lib/schemas"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm, SubmitHandler } from "react-hook-form"

interface ResetPasswordFormData {
	password: string
	confirmPassword: string
}

const ValidatePasswordPage: React.FC = () => {
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const { id, token, role } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		api.get(`/dashboard/account/reset-password${id}/${token}/${role}`).catch(() => {
			setError(true)
			setErrorMessage("Error 404 - Link no válido")
		})
	}, [id, token, role])

	if (!id || !role || !token) throw new Error("Datos incompletos")

	const payload = jwtDecode<{ role: string }>(role)
	const validationSchema = resetPasswordSchema(payload.role as any)
	const methods = useForm<ResetPasswordFormData>({
		resolver: zodResolver(validationSchema),
	})

	const { handleSubmit, reset } = methods

	const onSubmit: SubmitHandler<ResetPasswordFormData> = async (formData) => {
		try {
			const response = await api.post(`/dashboard/account/reset-password/${id}/${token}/${role}`, {
				password: formData.password,
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

			<Show when={error === false}>
				<div className="flex w-full login-container items-center justify-center absolute">
					<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg h-4/6 login-form-container">
						<div className="w-full max-w-md">
							<h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
								Restablecer Contraseña
							</h2>
							<p className="text-center text-gray-600 mb-6">Ingresa y confirma tu nueva contraseña.</p>

							{errorMessage && <p className="text-red text-center mb-4">{errorMessage}</p>}

							<FormProvider {...methods}>
								<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
									<Input
										name="password"
										label="Nueva Contraseña"
										type="password"
										placeholder="Ingresa tu nueva contraseña"
									/>

									<Input
										name="confirmPassword"
										label="Confirmar Contraseña"
										type="password"
										placeholder="Confirma tu nueva contraseña"
									/>

									<div className="mt-4">
										<button
											type="submit"
											className="bg-green-800 text-neutral-100 rounded-lg p-2 w-full h-12 font-bold"
										>
											Restablecer Contraseña
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
