import React from "react"

import { Button } from "@/components/Button"
import { useRouter } from "expo-router"
import { primaryGreen } from "@/constants/Colors"
import { LoadingIndicator } from "@/components/Loading"
import { useEffect, useState } from "react"
import { MultiStepProgressBar } from "@/components/ProgressBar"
import { StyleSheet, Text, View, Platform } from "react-native"

const { OS } = Platform

interface Props {
	title?: string
	description?: string
	continueHandler: () => void | Promise<void>
	currentStep: 1 | 2 | 3 | 4 | 5
	children: React.ReactNode
	loading?: boolean
	goBackEnabled?: boolean
	continueText?: string
}

export const ReservationStep: React.FC<Props> = ({ loading = false, ...props }) => {
	const router = useRouter()

	const {
		continueHandler,
		title,
		description,
		currentStep,
		goBackEnabled = true,
		continueText = "Continuar",
		children,
	} = props

	const [localLoading, setLocalLoading] = useState(loading)

	useEffect(() => {
		if (loading) {
			setLocalLoading(true)
		} else {
			const timeout = setTimeout(() => setLocalLoading(false), 100)
			return () => clearTimeout(timeout)
		}
	}, [loading])

	return (
		<View style={styles.container}>
			<View style={styles.progressBar}>
				<MultiStepProgressBar currentStep={currentStep} nSteps={5} />
			</View>
			<View style={styles.dataContainer}>
				<View style={styles.textContainer}>
					{title && (
						<Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 5 }}>
							{title}
						</Text>
					)}
					{description && <Text style={{ fontSize: 16 }}>{description}</Text>}
				</View>
				{localLoading ? <LoadingIndicator /> : <View>{children}</View>}
				<View style={{ ...styles.buttonsContainer, height: goBackEnabled ? "20%" : "10%" }}>
					<Button
						text={continueText}
						onPress={() => continueHandler()}
						variant="primary"
						size="lg"
					/>
					{goBackEnabled && (
						<Button
							text="Volver atrás"
							onPress={() => router.back()}
							variant="tertiary"
							size="lg"
						/>
					)}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: primaryGreen,
		alignItems: "center",
		padding: 15,
		gap: "2%",
		width: "100%",
		height: "100%",
	},
	progressBar: {
		width: "100%",
		height: "8%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 15,
		paddingHorizontal: 15,
		marginTop: OS === "ios" ? "12%" : "5%",
	},
	dataContainer: {
		borderRadius: 15,
		backgroundColor: "white",
		width: "100%",
		height: "80%",
		gap: 5,
		padding: 20,
	},
	textContainer: {
		height: "15%",
		gap: 10,
	},
	buttonsContainer: {
		flexDirection: "column",
		alignContent: "center",
		justifyContent: "center",
		width: "100%",
		gap: 15,
	},
})
