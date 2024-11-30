import React from "react"

import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native"
import { useAuth } from "@/contexts/authContext"

type GoBackButtonProps = {
	navigation: any
	visible?: boolean
	style?: ViewStyle
}

const LogoutButton = ({ navigation, visible, style }: GoBackButtonProps) => {
	const { logout } = useAuth()

	const handleLogout = () => {
		logout()
		navigation.navigate("Login")
	}

	return (
		<>
			{visible && (
				<TouchableOpacity
					onPress={handleLogout}
					style={{ zIndex: 1, ...style }}
				>
					<MaterialIcons name="logout" size={30} color="white" />
				</TouchableOpacity>
			)}
		</>
	)
}

export default LogoutButton

const styles = StyleSheet.create({
	logoutButton: {
	},
})