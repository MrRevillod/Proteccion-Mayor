import dayjs from "dayjs"

import { Text } from "@/components/Text"
import { Image } from "@/components/Image"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { useAlert } from "@/context/AlertContext"
import { useRouter } from "expo-router"
import { useMutation } from "@/hooks/useMutation"
import { ProfileInfo } from "@/components/ProfileInfo"
import { deleteAccount } from "@/lib/actions"
import { StyleSheet, View } from "react-native"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"

const ProfileTab = () => {
	useProtectedRoute()
	const router = useRouter()

	const { user } = useAuth()
	const { alert } = useAlert()

	const { mutate, loading } = useMutation({
		mutateFn: deleteAccount,
	})

	const handleDelete = async () => {
		await mutate({
			params: { id: user?.id ?? "" },
			onSuccess: () => {
				return router.replace("/login")
			},
			onError: () => {
				alert({
					title: "Error",
					message: "No se pudo eliminar la cuenta. Inténtalo de nuevo más tarde.",
					variant: "simple",
				})
				return router.replace("/(tabs)/home")
			},
		})
	}

	const showDeleteAlert = () => {
		alert({
			title: "Eliminar cuenta",
			message: "¿Estás seguro de que deseas eliminar tu cuenta?",
			variant: "confirmCancel",
			onConfirm: handleDelete,
		})
	}

	return (
		<View style={styles.container}>
			<Image source="/users/default-profile.webp" style={styles.image} cache />
			<View style={styles.contentContainer}>
				<View style={styles.infoContainer}>
					<Text style={styles.title}>{user?.name}</Text>
					<View style={styles.infoContainer}>
						<ProfileInfo iconName="envelope" title="Correo" data={user?.email ?? ""} />
						<ProfileInfo
							iconName="map-marker"
							title="Dirección"
							data={user?.address ?? ""}
						/>
						<ProfileInfo
							iconName="calendar"
							title="Fecha de registro"
							data={dayjs(user?.createdAt).format("DD / MM / YYYY")}
						/>
					</View>
				</View>
				<View style={styles.buttonContainer}>
					<Button
						text="Cambiar PIN de acceso"
						size="lg"
						onPress={() =>
							router.push({
								pathname: "/(tabs)/(profile)/change-pin",
								params: { user: JSON.stringify(user) },
							})
						}
					/>
					<Button
						text="Eliminar cuenta"
						size="lg"
						onPress={() => handleDelete()}
						variant="delete"
					/>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		paddingHorizontal: "5%",
	},
	image: {
		width: 150,
		height: 150,
		position: "absolute",
		zIndex: 1,
		borderRadius: 75,
		top: -150 / 2,
		alignSelf: "center",
		borderWidth: 4,
		borderColor: "white",
	},
	contentContainer: {
		marginTop: "30%",
		alignItems: "center",
		paddingHorizontal: 20,
		gap: "10%",
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginVertical: 10,
		textAlign: "center",
	},
	infoContainer: {
		width: "100%",
		gap: 15,
	},
	buttonContainer: {
		marginTop: 30,
		width: "100%",
		gap: 15,
	},
})

export default ProfileTab
