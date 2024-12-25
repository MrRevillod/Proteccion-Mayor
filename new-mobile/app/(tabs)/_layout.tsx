import React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"

import { Tabs } from "expo-router"
import { Header } from "@/components/Header"
import { primaryGreen } from "@/constants/Colors"
import { StyleSheet, View, Dimensions, Platform } from "react-native"

const { height } = Dimensions.get("window")

const isIos = Platform.OS === "ios"

const TabLayout = () => {
	return (
		<Tabs>
			<Tabs.Screen
				name="profile"
				options={{
					header: () => <Header title="" />,
					tabBarIcon: () => <FontAwesome name="user" color="white" size={35} />,
					tabBarStyle: { ...styles.tabBar },
					tabBarIconStyle: { height: "100%", width: "100%" },
					tabBarLabel: () => null,
				}}
			/>
			<Tabs.Screen
				name="home"
				options={{
					header: () => <Header title="Protección Mayor" />,
					tabBarIcon: () => (
						<View style={styles.centerTabIcon}>
							<FontAwesome name="home" style={styles.centerIcon} />
						</View>
					),
					tabBarStyle: { ...styles.tabBar },
					tabBarLabel: () => null,
				}}
			/>
			<Tabs.Screen
				name="agenda"
				options={{
					header: () => <Header title="Mi Agenda" />,
					tabBarIcon: () => <FontAwesome name="calendar" color="white" size={35} />,
					tabBarStyle: { ...styles.tabBar },
					tabBarIconStyle: { height: "100%", width: "100%" },
					tabBarLabel: () => null,
				}}
			/>
		</Tabs>
	)
}

const styles = StyleSheet.create({
	tabBar: {
		backgroundColor: primaryGreen,
		paddingTop: 10,
		height: isIos ? height * 0.11 : height * 0.09,
		borderTopWidth: 0,
	},
	centerTabIcon: {
		width: 80,
		height: 80,
		borderRadius: 100,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 3,
		borderColor: primaryGreen,
		top: 0,
	},
	centerIcon: {
		color: primaryGreen,
		fontSize: 45,
	},
})

export default TabLayout
