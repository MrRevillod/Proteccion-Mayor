import React from "react"

import { z } from "zod"
import { api } from "../../lib/axios"
import { Input } from "../../components/ui/Input"
import { Helmet } from "react-helmet"
import { message } from "antd"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useLocation, useSearchParams } from "react-router-dom"

const ResetPasswordPage: React.FC = () => {
	const location = useLocation()

	const formSchemas = z.object({
		email: z.string().email({
			message: "Correo electrónico inválido",
		}),
		role: z.enum(["ADMIN", "PROFESSIONAL", "SENIOR"]),
	})

	const [searchParams] = useSearchParams()
	const methods = useForm({ resolver: zodResolver(formSchemas) })
	const { handleSubmit, reset, setValue } = methods

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search)
		if (searchParams.has("variant") && searchParams.get("variant") === "mobile") {
			setValue("role", "SENIOR")
		}
	}, [])

	const onSubmit = async (data: any) => {
		try {
			const response = await api.post(`/dashboard/account/reset-password?variant=${data.role}`, {
				email: data.email,
			})

			message.success(response.data.message)
			reset()
		} catch (error: any) {
			message.error(error.response.data.message || "Error inesperado.")
		}
	}

	return (
		<FormProvider {...methods}>
			<Helmet>
				<title>Restablecer contraseña - Dirección de personas mayores de la municipalidad de Temuco</title>
			</Helmet>

			<div className="flex w-full login-container items-center justify-center absolute">
				<div className="bg-white flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg h-4/6 login-form-container">
					<div className="w-full max-w-md">
						<h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Restablecer Contraseña</h2>
						<p className="text-center text-gray-600 mb-6">
							Por favor, ingresa tu correo electrónico y selecciona tu tipo de usuario para continuar.
						</p>

						<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
							<Input
								label="Correo electrónico"
								type="email"
								name="email"
								placeholder="example@gmail.com"
							/>

							<Input
								label="Ocupación"
								type="select"
								name="role"
								options={[
									{ value: "ADMIN", label: "Administrador" },
									{ value: "PROFESSIONAL", label: "Profesional" },
									{ value: "SENIOR", label: "Persona Mayor" },
								]}
								defaultValue={searchParams.get("variant") || "ADMIN"}
							/>

							<div className="mt-4">
								<button
									type="submit"
									className="bg-green-800 text-neutral-100 rounded-lg p-2 w-full h-12 font-bold"
								>
									Enviar
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</FormProvider>
	)
}

export default ResetPasswordPage
