import { Text } from "@/components/Text"
import { useRouter } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"
import { primaryGreen } from "@/constants/Colors"
import { StyleSheet, TouchableOpacity, View, Platform, Dimensions } from "react-native"

const { height } = Dimensions.get("window")
const isIos = Platform.OS === "ios"

interface HeaderProps {
	title: string
	goBack?: () => void
	customHeight?: any
}

export const Header = ({ title, goBack, customHeight }: HeaderProps) => {
	const router = useRouter()
	const canGoBack = router.canGoBack()

	const styles = StyleSheet.create({
		header: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: primaryGreen,
			color: "#fff",
			paddingHorizontal: 45,
			paddingTop: isIos ? 50 : 0,
			height: customHeight ? customHeight : isIos ? height * 0.15 : 120,
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
