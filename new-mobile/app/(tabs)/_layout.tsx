import React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"

import { Tabs } from "expo-router"
import { Header } from "@/components/Header"
import { primaryGreen } from "@/constants/Colors"
import { StyleSheet, View } from "react-native"

const TabLayout = () => {
	return (
		<Tabs>
			<Tabs.Screen
				name="profile"
				options={{
					header: () => <Header title="" height={250} />,
					tabBarIcon: () => <FontAwesome name="user" color="white" size={35} />,
					tabBarStyle: { ...styles.tabBar },
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
					tabBarLabel: () => null,
				}}
			/>
		</Tabs>
	)
}

const styles = StyleSheet.create({
	tabBar: {
		backgroundColor: primaryGreen,
		paddingTop: 15,
		height: 100,
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
