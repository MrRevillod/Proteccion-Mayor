import { Button } from "@/components/Button"
import { useRouter } from "expo-router"
import { View, Text } from "react-native"
import { ExternalLink } from "@/components/ExternalLink"
import { RESET_PASSWORD_URL } from "@/lib/http"
import { Image, ImageBackground, StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

const WelcomeScreen = () => {
	const router = useRouter()

	return (
		<View style={styles.container}>
			<ImageBackground
				style={styles.background}
				source={require("@/assets/images/welcome-bg.png")}
				imageStyle={{ width, height, resizeMode: "cover" }}
			>
				<Image style={styles.logo} source={require("@/assets/images/logo.png")} />
				<Text style={styles.welcomeText}>Bienvenido a Protección Mayor</Text>

				<View style={{ width: "100%", gap: 20, alignItems: "center" }}>
					<Button
						variant="secondary"
						text="Ingresar"
						onPress={() => router.push("/login")}
						size="xl"
					/>
					<Button
						variant="quaternary"
						text="Registrarme"
						onPress={() => router.push("/(register)/instructions")}
						size="xl"
					/>
				</View>

				<View style={{ marginTop: 20, backgroundColor: "transparent" }}>
					<ExternalLink href={RESET_PASSWORD_URL}>
						<Text
							style={{
								color: "#fff",
								fontSize: 18,
								textAlign: "center",
								fontWeight: "600",
							}}
						>
							¿Olvidaste tu PIN de acceso?
						</Text>
					</ExternalLink>
				</View>
				<Button
					variant="quaternary"
					text="Sitemap"
					onPress={() => router.push("/_sitemap")}
					size="xl"
				/>
			</ImageBackground>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	background: {
		flex: 1,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#004d40",
		paddingHorizontal: 20,
	},
	logo: {
		width: width * 0.5,
		height: height * 0.25,
		resizeMode: "contain",
		marginBottom: 30,
	},
	welcomeText: {
		color: "white",
		fontSize: 25,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 40,
		textShadowColor: "rgba(0, 0, 0, 0.4)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 4,
	},
})

export default WelcomeScreen
