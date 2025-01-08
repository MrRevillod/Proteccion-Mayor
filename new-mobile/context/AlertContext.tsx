import React, { createContext, useContext, useState, ReactNode } from "react"

import { Text } from "@/components/Text"
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native"

interface AlertOptions {
	title: string
	message: string
	onConfirm?: () => void
	onCancel?: () => void
	variant?: "simple" | "confirmCancel"
	confirmText?: string
	cancelText?: string
}

interface AlertContextProps {
	alert: (options: AlertOptions) => void
	setVisible: (visible: boolean) => void
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined)

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [visible, setVisible] = useState(false)
	const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null)

	const alert = (options: AlertOptions) => {
		setAlertOptions(options)
		setVisible(true)
	}

	const handleConfirm = () => {
		setVisible(false)
		alertOptions?.onConfirm?.()
	}

	const handleCancel = () => {
		setVisible(false)
		alertOptions?.onCancel?.()
	}

	return (
		<AlertContext.Provider value={{ alert, setVisible }}>
			{children}
			<Modal transparent animationType="fade" visible={visible}>
				<View style={styles.overlay}>
					<View style={styles.alertBox}>
						<Text style={styles.title}>{alertOptions?.title}</Text>
						<Text style={styles.message}>{alertOptions?.message}</Text>
						{alertOptions?.variant === "simple" && (
							<TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
								<Text style={styles.confirmButtonText}>
									{alertOptions?.confirmText ?? "Entendido"}
								</Text>
							</TouchableOpacity>
						)}
						{alertOptions?.variant === "confirmCancel" && (
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={{ ...styles.cancelButton, width: "45%" }}
									onPress={handleCancel}
								>
									<Text style={styles.cancelButtonText}>
										{alertOptions?.cancelText || "No"}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{ ...styles.confirmButton, width: "45%" }}
									onPress={handleConfirm}
								>
									<Text style={styles.confirmButtonText}>
										{alertOptions?.confirmText || "Sí"}
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</Modal>
		</AlertContext.Provider>
	)
}

export const useAlert = (): AlertContextProps => {
	const context = useContext(AlertContext)
	if (!context) {
		throw new Error("useAlert must be used within an AlertProvider")
	}
	return context
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000,
		elevation: 1000,
	},
	alertBox: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 25,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		color: "#046c4e",
		textAlign: "center",
	},
	message: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 25,
		color: "#333",
		lineHeight: 22,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	confirmButton: {
		backgroundColor: "#046c4e",
		paddingVertical: 10,
		paddingHorizontal: 40,
		borderRadius: 8,
		marginTop: 10,
	},
	confirmButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center",
	},
	cancelButton: {
		backgroundColor: "#d9534f",
		paddingVertical: 10,
		paddingHorizontal: 40,
		borderRadius: 8,
		marginTop: 10,
	},
	cancelButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center",
	},
})
