import React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"

import { Tabs } from "expo-router"
import { Header } from "@/components/Header"
import { primaryGreen } from "@/constants/Colors"
import { AppStateHandler } from "@/components/AppState"
import { StyleSheet, View, Dimensions, Platform } from "react-native"

const { height } = Dimensions.get("window")

const isIos = Platform.OS === "ios"

const TabLayout = () => {
	return (
		<>
			<AppStateHandler />
			<Tabs>
				<Tabs.Screen
					name="(profile)/index"
					options={{
						header: () => <Header title="" customHeight={200} />,
						tabBarIcon: () => <FontAwesome name="user" color="white" size={35} />,
						tabBarStyle: { ...styles.tabBar },
						tabBarIconStyle: { height: "100%", width: "100%" },
						tabBarLabel: () => null,
					}}
				/>
				<Tabs.Screen
					name="(profile)/change-pin"
					options={{
						header: () => <Header title="Cambiar PIN de acceso" />,
						tabBarIcon: () => null,
						tabBarLabel: () => null,
						tabBarItemStyle: { display: "none" },
						tabBarStyle: { ...styles.tabBar },
					}}
				/>
				<Tabs.Screen
					name="(profile)/confirm-delete"
					options={{
						header: () => <Header title="Eliminar cuenta" />,
						tabBarIcon: () => null,
						tabBarLabel: () => null,
						tabBarItemStyle: { display: "none" },
						tabBarStyle: { ...styles.tabBar },
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
					name="(agenda)/index"
					options={{
						header: () => <Header title="Mi Agenda" />,
						tabBarIcon: () => <FontAwesome name="calendar" color="white" size={35} />,
						tabBarStyle: { ...styles.tabBar },
						tabBarIconStyle: { height: "100%", width: "100%" },
						tabBarLabel: () => null,
					}}
				/>

				<Tabs.Screen
					name="(agenda)/cancel-status"
					options={{
						tabBarIcon: () => null,
						header: () => <Header title="Mi Agenda" />,
						tabBarLabel: () => null,
						tabBarItemStyle: { display: "none" },
						tabBarStyle: { ...styles.tabBar },
					}}
				/>

				<Tabs.Screen
					name="(agenda)/event-details"
					options={{
						tabBarIcon: () => null,
						header: () => <Header title="Mi Agenda" />,
						tabBarLabel: () => null,
						tabBarItemStyle: { display: "none" },
						tabBarStyle: { ...styles.tabBar },
					}}
				/>
			</Tabs>
		</>
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
