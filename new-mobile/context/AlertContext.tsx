import React, { createContext, useContext, useState, ReactNode } from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface AlertOptions {
	title: string
	message: string
	onClose?: () => void
}

interface AlertContextProps {
	showAlert: (options: AlertOptions) => void
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined)

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [visible, setVisible] = useState(false)
	const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null)

	const showAlert = (options: AlertOptions) => {
		setAlertOptions(options)
		setVisible(true)
	}

	const handleClose = () => {
		setVisible(false)
		alertOptions?.onClose?.()
	}

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			<Modal transparent animationType="fade" visible={visible}>
				<View style={styles.overlay}>
					<View style={styles.alertBox}>
						<Text style={styles.title}>{alertOptions?.title}</Text>
						<Text style={styles.message}>{alertOptions?.message}</Text>
						<TouchableOpacity style={styles.okButton} onPress={handleClose}>
							<Text style={styles.okButtonText}>Entendido</Text>
						</TouchableOpacity>
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
	okButton: {
		backgroundColor: "#046c4e",
		paddingVertical: 10,
		paddingHorizontal: 40,
		borderRadius: 8,
		marginTop: 10,
	},
	okButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 18,
		textAlign: "center",
	},
})
