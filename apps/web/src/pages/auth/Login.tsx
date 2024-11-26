import React from "react"

import { Input } from "../../components/ui/Input"
import { Helmet } from "react-helmet"
import { useAuth } from "../../context/AuthContext"
import { Fragment } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormData } from "../../lib/types"
import { LoginFormSchema } from "../../lib/schemas"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
const LoginPage: React.FC = () => {
	const lastLoginRole = localStorage.getItem("role")

	const methods = useForm({
		resolver: zodResolver(LoginFormSchema),
	})

	const { handleSubmit } = methods
	const { login, error } = useAuth()

	const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
		await login(formData)
		return
	}

	return (
		<Fragment>
			<Helmet>
				<title>Iniciar sesión - Dirección de personas mayores de la municipalidad de Temuco</title>
			</Helmet>

			<div className="flex w-full login-container items-center justify-center absolute dark:shadow-none">
				<div className="bg-white dark:bg-primary-dark flex flex-col justify-center items-center px-12 w-11/12 md:w-1/2 lg:w-1/3 xl:w-5/12 2xl:w-1/4 rounded-lg h-4/6 login-form-container dark:shadow-none">
					<div className="w-full max-w-md">
						<h2 className="text-4xl font-bold text-gray-900 dark:text-neutral-300 text-center mb-4">
							¡Hola!
						</h2>
						<p className="text-center text-gray-600 dark:text-gray-dark mb-6">
							Dirección de personas mayores de la municipalidad de Temuco.
						</p>

						<div className={error ? "opacity-100 transition-opacity" : "opacity-0 transition-opacity"}>
							<p className="text-red text-center mb-4">{error}</p>
						</div>

						<FormProvider {...methods}>
							<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit as any)}>
								<Input
									name="email"
									label="Correo electrónico"
									type="email"
									placeholder="example@gmail.com"
								/>

								<Input
									name="password"
									label="Contraseña"
									type="password"
									placeholder="●●●●●●●●●●"
									login
								/>

								<Input
									name="role"
									label="Ocupación"
									type="select"
									options={[
										{ value: "ADMIN", label: "Administrador" },
										{ value: "PROFESSIONAL", label: "Profesional" },
									]}
									defaultValue={lastLoginRole || "ADMIN"}
								/>

								<div className="mt-4">
									<button
										type="submit"
										className="bg-green-800 text-neutral-100 rounded-lg p-2  w-full h-12 font-bold"
									>
										Iniciar sesión
									</button>
								</div>
							</form>
						</FormProvider>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default LoginPage
