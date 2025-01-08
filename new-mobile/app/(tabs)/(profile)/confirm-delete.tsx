import React, { useCallback } from "react"

import { z } from "zod"
import { Text } from "@/components/Text"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { LoadingIndicator } from "@/components/Loading"

import { useAlert } from "@/context/AlertContext"
import { useMutation } from "@/hooks/useMutation"
import { deleteAccount } from "@/lib/actions"
import { deleteSecureStore } from "@/lib/secureStore"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, View } from "react-native"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"

const ConfirmDeleteAccountScreen = () => {
	const methods = useForm({
		defaultValues: { password: "" },
		resolver: zodResolver(
			z.object({
				password: z.string().refine((value) => /^\d{4}$/.test(value), {
					message: "Solo se permiten números",
				}),
			}),
		),
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
	const { mutate, loading } = useMutation({ mutateFn: deleteAccount })

	const handleDelete = async () => {
		await Promise.all([
			deleteSecureStore("rut"),
			deleteSecureStore("accessToken"),
			deleteSecureStore("refreshToken"),
		])

		return router.replace("/login")
	}

	const onSubmit = async (data: { password: string }) => {
		await methods.trigger("password")

		await mutate({
			params: {
				id: user?.id ?? "",
				query: `credentials=${data.password}`,
			},
			onSuccess: () => {
				alert({
					title: "Cuenta eliminada",
					message: "Su cuenta ha sido eliminada correctamente",
					variant: "simple",
					onConfirm: () => handleDelete(),
				})
			},
			onError: () => {
				alert({
					title: "Error",
					message: "Error al eliminar la cuenta. Inténtalo de nuevo más tarde.",
					variant: "simple",
					onConfirm: () => router.replace("/(tabs)/home"),
				})
			},
		})

		methods.reset()
		Keyboard.isVisible() && Keyboard.dismiss()
	}

	return (
		<View style={styles.container}>
			<View style={styles.textContainer}>
				<Text style={styles.title}>Información importante</Text>
				<Text style={styles.subtitle}>
					Al eliminar tu cuenta, perderás todos tus datos y no podrás recuperarlos.
				</Text>
			</View>

			{loading && (
				<View style={styles.loadingOverlay}>
					<LoadingIndicator color="white" />
				</View>
			)}
			<View style={styles.formContainer}>
				<FormProvider {...methods}>
					<Input
						label="Ingrese su PIN"
						name="password"
						placeholder="● ● ● ●"
						keyboardType="number-pad"
						maxLength={4}
						secureTextEntry
						autoFocus={false}
					/>
				</FormProvider>
			</View>

			<View style={styles.bottomContainer}>
				<Button
					text="Eliminar cuenta"
					onPress={methods.handleSubmit(onSubmit)}
					variant="delete"
				/>
				<Button text="Cancelar" onPress={() => router.back()} variant="primary" />
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
		zIndex: 100,
	},
	textContainer: {
		width: "100%",
		marginTop: 20,
		paddingHorizontal: 20,
		gap: 12,
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 17,
	},
})

export default ConfirmDeleteAccountScreen
