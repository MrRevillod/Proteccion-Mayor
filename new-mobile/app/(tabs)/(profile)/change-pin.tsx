import React, { useCallback, useState } from "react"

import { z } from "zod"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { useAlert } from "@/context/AlertContext"
import { updateUser } from "@/lib/actions"
import { useMutation } from "@/hooks/useMutation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangePinSchema } from "@/lib/schemas"
import { FormProvider, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, View } from "react-native"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { LoadingIndicator } from "@/components/Loading"

const ChangePinScreen = () => {
	const methods = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(ChangePinSchema),
	})

	useFocusEffect(
		useCallback(() => {
			return () => {
				methods.reset()
				Keyboard.dismiss()
			}
		}, []),
	)

	const router = useRouter()
	const params = useLocalSearchParams()
	const user = JSON.parse(params.user.toString())

	const { alert } = useAlert()
	const { mutate, loading } = useMutation({ mutateFn: updateUser })

	const onSubmit = async (data: z.infer<typeof ChangePinSchema>) => {
		await Promise.all([methods.trigger("password"), methods.trigger("confirmPassword")])

		const body = {
			name: user?.name,
			address: user?.address,
			email: user?.email,
			birthDate: user?.birthDate,
			password: data.password,
			confirmPassword: data.confirmPassword,
		}

		await mutate({
			params: { id: user?.id ?? "", body },
			onSuccess: () => {
				alert({
					title: "PIN actualizado",
					message: "Su PIN de acceso ha sido actualizado correctamente",
					variant: "simple",
				})
			},
			onError: () => {
				alert({
					title: "Error",
					message: "No se ha podido actualizar su PIN de acceso",
					variant: "simple",
				})
			},
		})

		methods.reset()
		Keyboard.dismiss()

		router.back()
	}

	return (
		<View style={styles.container}>
			<View style={styles.formContainer}>
				{loading && (
					<View style={styles.loadingOverlay}>
						<LoadingIndicator />
					</View>
				)}

				<FormProvider {...methods}>
					<Input
						label="Ingrese su nuevo PIN"
						name="password"
						placeholder="● ● ● ●"
						keyboardType="number-pad"
						maxLength={4}
						secureTextEntry
						autoFocus={false}
					/>
					<Input
						label="Repita su nuevo PIN"
						name="confirmPassword"
						placeholder="● ● ● ●"
						keyboardType="number-pad"
						maxLength={4}
						secureTextEntry
						autoFocus={false}
					/>
				</FormProvider>
			</View>

			<View style={styles.bottomContainer}>
				<Button text="Confirmar" onPress={methods.handleSubmit(onSubmit)} />
				<Button text="Cancelar" onPress={() => router.back()} variant="secondary" />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		height: "100%",
		backgroundColor: "white",
		alignItems: "center",
		gap: 10,
	},
	formContainer: {
		width: "100%",
		marginTop: 20,
		paddingHorizontal: 20,
		gap: 20,
		justifyContent: "center",
	},
	bottomContainer: {
		width: "100%",
		paddingHorizontal: 20,
		marginTop: 20,
		alignItems: "center",
		gap: 10,
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		alignItems: "center",
		justifyContent: "center",
	},
})

export default ChangePinScreen
