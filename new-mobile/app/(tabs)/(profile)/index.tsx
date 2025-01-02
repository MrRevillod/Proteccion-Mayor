import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { ProfileInfo } from "@/components/ProfileInfo"
import { StyleSheet, View } from "react-native"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { DEFAULT_PROFILE_PICTURE } from "@/lib/http"
import { Image } from "@/components/Image"
import dayjs from "dayjs"

const ProfileTab = () => {
	useProtectedRoute()

	const { user } = useAuth()

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
							title="Cuenta creada"
							data={dayjs(user?.createdAt).format("DD/MM/YYYY")}
						/>
					</View>
				</View>
				<View style={styles.buttonContainer}>
					<Button text="Cambiar PIN de acceso" size="lg" onPress={() => null} />
					<Button
						text="Eliminar cuenta"
						size="lg"
						onPress={() => null}
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
		marginTop: "25%",
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
