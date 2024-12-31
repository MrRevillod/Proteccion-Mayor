import clsx from "clsx"
import React from "react"

import { z } from "zod"
import { api } from "../../lib/axios"
import { Input } from "../../components/ui/Input"
import { Helmet } from "react-helmet"
import { message } from "antd"
import { Loading } from "@/components/Loading"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"

const ResetPasswordPage: React.FC = () => {
	const formSchemas = z.object({
		email: z.string().email({
			message: "Correo electrónico inválido",
		}),
		role: z.enum(["ADMIN", "PROFESSIONAL", "SENIOR"]),
	})

	const [searchParams] = useSearchParams()
	const methods = useForm({ resolver: zodResolver(formSchemas) })
	const { handleSubmit, reset, setValue } = methods
	const [isLoading, setIsLoading] = useState(false)

	if (searchParams.has("variant") && searchParams.get("variant") === "mobile") {
		setValue("role", "SENIOR")
	}

	const onSubmit = async (data: any) => {
		setIsLoading(true)

		try {
			const response = await api.post(`/auth/account/reset-password?variant=${data.role}`, {
				email: data.email,
			})

			message.success(response.data.message)
			reset()
		} catch (error: any) {
			message.error(error.response.data.message || "Error inesperado.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<FormProvider {...methods}>
			<Helmet>
				<title>Restablecer contraseña - Dirección de personas mayores de la municipalidad de Temuco</title>
			</Helmet>

			<div className="flex w-full login-container items-center justify-center absolute">
				<div
					className={clsx(
						isLoading ? "opacity-90 pointer-events-none bg-neutral-200" : "",
						"bg-white dark:bg-primary-dark flex flex-col justify-center items-center px-8 md:px-12 w-11/12 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:1/3 2xl:w-1/4 rounded-lg h-2/3 min-h-[550px] login-form-container dark:shadow-none",
					)}
				>
					<div className="w-full max-w-md">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
							Restablecer Contraseña
						</h2>
						<p className="text-center text-gray-600 mb-6">
							Por favor, ingresa tu correo electrónico y selecciona tu tipo de usuario para continuar.
						</p>

						<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
							{isLoading && <Loading />}

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
