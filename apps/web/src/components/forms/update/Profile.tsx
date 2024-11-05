import React from "react"

import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import { useAuth } from "../../../context/AuthContext"
import { message } from "antd"
import { useMutation } from "../../../hooks/useMutation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageSelector } from "../../ImageSelector"
import { AdministratorSchemas } from "../../../lib/schemas"
import { MutationResponse, User } from "../../../lib/types"
import { buildRequestBody, handleFormError } from "../../../lib/form"
import { useEffect, Dispatch, SetStateAction } from "react"
import { updateAdministrator, updateProfessional } from "../../../lib/actions"
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form"

interface UpdateProfileProps {
	setImageSrc: Dispatch<SetStateAction<string | null>>
	setShowUpdateForm: Dispatch<SetStateAction<boolean>>
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ setImageSrc, setShowUpdateForm }) => {
	const methods = useForm({ resolver: zodResolver(AdministratorSchemas.Update) })

	const { user, setUser, role } = useAuth()
	const { reset, handleSubmit, setError } = methods

	const handleReset = () => {
		reset({
			name: user?.name,
			email: user?.email,
			password: "",
			confirmPassword: "",
			image: null,
		})
	}

	const handleCancel = () => {
		setShowUpdateForm(false)
		handleReset()
	}

	useEffect(() => {
		if (user) handleReset()
	}, [user])

	const mutation = useMutation<MutationResponse<User>>({
		mutateFn: role === "ADMIN" ? updateAdministrator : updateProfessional,
	})

	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
		const originalData = {
			name: user?.name,
			email: user?.email,
			password: "",
			confirmPassword: "",
			image: null,
		}

		if (JSON.stringify(formData) === JSON.stringify(originalData)) {
			message.error("No se han realizado cambios")
			return
		}

		const body = buildRequestBody(formData)

		await mutation.mutate({
			params: { id: user?.id, body },
			onSuccess: (data) => {
				setUser(data.modified)
				if (data.image) setImageSrc(`${data.image}?${Date.now()}`)
				message.success("Hecho")
				handleReset()
				setTimeout(() => {}, 2000)
				setShowUpdateForm(false)
			},
			onError: (error) => {
				message.error(error)
				if (error?.conflicts) {
					handleFormError(error, setError)
				}
			},
		})
	}

	return (
		<FormProvider {...methods}>
			<div className="w-full mb-4">
				<h3 className="font-semibold text-start text-xl text-dark dark:text-light">
					Editar información del perfil
				</h3>
			</div>

			<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<Input name="name" label="Nombre" type="text" placeholder="Nombre" />
				<Input name="email" label="Correo Electrónico" type="email" placeholder="Correo Electrónico" />

				<Input name="password" label="Contraseña" type="password" placeholder="••••••••" />
				<Input name="confirmPassword" label="Confirmar contraseña" type="password" placeholder="••••••••" />

				<ImageSelector imageLabel="Imagen de perfil" size={[250, 250]} />

				<div className="flex flex-row gap-4 w-full justify-end mt-4">
					<Button variant="secondary" onClick={() => handleCancel()} className="w-1/4" type="button">
						Volver
					</Button>
					<Button type="submit" variant="primary" className="w-1/4">
						Guardar
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}

export default UpdateProfile
