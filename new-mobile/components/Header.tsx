import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"
import { primaryGreen } from "@/constants/Colors"
import { StyleSheet, TouchableOpacity, View, Text, Platform } from "react-native"

interface HeaderProps {
	title: string
	goBack?: () => void
	height?: number
	variant?: "default" | "modal"
}

export const Header = ({ title, goBack, height, variant = "default" }: HeaderProps) => {
	const router = useRouter()
	const canGoBack = router.canGoBack()

	const paddingTop = variant === "modal" ? 0 : 50
	const heightStyle = variant === "modal" ? 100 : height ?? 120

	const styles = StyleSheet.create({
		header: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: primaryGreen,
			color: "#fff",
			paddingHorizontal: 45,
			paddingTop: Platform.OS === "ios" ? paddingTop : 0,
			height: heightStyle,
		},
		headerTitleContainer: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "transparent",
		},
		headerTitle: {
			fontSize: 25,
			fontWeight: "bold",
			color: "#fff",
		},
	})

	return (
		<View style={styles.header}>
			{goBack && canGoBack && (
				<TouchableOpacity onPress={goBack}>
					<FontAwesome name="arrow-left" style={{ fontSize: 20, color: "white" }} />
				</TouchableOpacity>
			)}
			<View style={styles.headerTitleContainer}>
				<Text style={styles.headerTitle}>{title}</Text>
			</View>
			{goBack && canGoBack && (
				<FontAwesome name="arrow-left" style={{ fontSize: 20, color: primaryGreen }} />
			)}
		</View>
	)
}
