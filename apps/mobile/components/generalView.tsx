import React from "react"
import Colors from "@/components/colors"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { useEffect, useState } from "react"
import { View, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform, StatusBar } from "react-native"

const { width, height } = Dimensions.get("window")

type GeneralViewProps = {
	title: string
	children: React.ReactNode
	textCircle?: string
	textTitle?: string
	textDescription?: string
	noBorders?: boolean
	hTitle?: boolean
}

const GeneralView = ({ title, children, ...props }: GeneralViewProps) => {
	const { textCircle, textTitle, textDescription, noBorders = false, hTitle = false } = props

	const [user, setUser] = useState<any>(null)
	useEffect(() => {
		const getUser = async () => {
			try {
				const user = await AsyncStorage.getItem("user")
				if (!user) {
					throw new Error("El usuario no existe")
				}
				const parsedUser = JSON.parse(user)
				setUser(parsedUser)
			} catch (error) {
				console.error("Error al obtener el usuario", error)
			}
		}
		getUser()
	}, [])

	const name = user?.name || "Juan"

	return (
		<>
			<StatusBar barStyle="light-content" backgroundColor={Colors.green} translucent={true} />
			<KeyboardAvoidingView
				style={{ backgroundColor: Colors.green, flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				enabled={true}
			>
				<View style={[!noBorders && styles.greenContainer, noBorders && styles.noBorderGreenContainer]}>
					{hTitle ? (
						<View style={styles.hasImageStyles}>
							<Text style={styles.title}>👋 ¡Hola {name}!</Text>
						</View>
					) : (
						<Text style={styles.title}>{title} </Text>
					)}
				</View>
				<View style={[!noBorders && styles.whiteContainer, noBorders && styles.noBorderWhiteContainer]}>
					<View style={styles.description}>
						{textCircle && textTitle && (
							<>
								<View style={[styles.circle, noBorders && { borderWidth: 0 }]}>
									<Text style={styles.circleText}>{textCircle}</Text>
								</View>
								<Text style={{ fontSize: 18, fontWeight: "500", flex: 1, alignSelf: "center" }}>{textTitle}</Text>
							</>
						)}
						{!textCircle && textTitle && (
							<Text style={{ fontSize: 20, fontWeight: "500", flex: 1, textAlign: "center" }}>{textTitle}</Text>
						)}
					</View>
					{textDescription && (
						<Text style={{ fontSize: 16, marginTop: 10, color: Colors.gray, textAlign: "justify" }}>{textDescription}</Text>
					)}
					{children}
				</View>
			</KeyboardAvoidingView>
		</>
	)
}

const styles = StyleSheet.create({
	greenContainer: {
		flex: 1,
		backgroundColor: Colors.green,
		justifyContent: "center",
		alignItems: "center",
		height: "15%",
	},
	noBorderGreenContainer: {
		flex: 1,
		backgroundColor: Colors.green,
		justifyContent: "center",
		alignItems: "center",
		height: "15%",
	},
	title: {
		alignSelf: "center",
		fontWeight: "700",
		fontSize: 22,
		color: "#FFFFFF",
		textAlign: "center",
		textShadowColor: "rgba(0, 0, 0, 0.25)",
		textShadowOffset: { width: 0, height: 5 * (height / 800) },
		textShadowRadius: 4 * (width / 360),
	},
	whiteContainer: {
		width: "100%",
		height: "85%",
		backgroundColor: "#FFFFFF",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: "10%",
	},
	noBorderWhiteContainer: {
		width: "100%",
		height: "85%",
		backgroundColor: "#FFFFFF",
		paddingHorizontal: "10%",
		paddingVertical: "10%",
	},
	description: {
		flexDirection: "row",
		height: "auto",
		margin: 0,
	},
	circle: {
		width: width * 0.15,
		height: width * 0.15,
		borderRadius: width * 0.1,
		justifyContent: "center",
		alignItems: "center",
		borderColor: Colors.green,
		borderWidth: 3,
		marginRight: 10,
	},
	circleText: {
		color: Colors.green,
		fontWeight: "bold",
		fontSize: 16,
	},
	imageCircle: {
		width: width * 0.2,
		height: width * 0.2,
		borderRadius: 100,
		borderColor: Colors.white,
		borderWidth: 2,
		backgroundColor: Colors.gray,
	},
	hasImageStyles: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		alignContent: "center",
		alignSelf: "center",
		width: "80%",
	},
})

export default GeneralView
