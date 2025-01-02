import React from "react"
import dayjs from "dayjs"

import { Text } from "@/components/Text"
import { Event } from "@/lib/types"
import { useAuth } from "@/context/AuthContext"
import { getEvents } from "@/lib/actions"
import { useRequest } from "@/hooks/useRequest"
import { useCallback } from "react"
import { SelectableItem } from "@/components/SelectableItem"
import { LoadingIndicator } from "@/components/Loading"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { router, useFocusEffect } from "expo-router"
import { StyleSheet, View, FlatList } from "react-native"

const AgendaTab = () => {
	useProtectedRoute()

	const { user } = useAuth()
	const { data, refetch, loading } = useRequest<{ formatted: Event[] }>({
		action: getEvents,
		query: `seniorId=${user?.id}`,
		trigger: false,
	})

	useFocusEffect(
		useCallback(() => {
			refetch()
		}, []),
	)

	const handleEventPress = (event: Event) => {
		router.push({
			pathname: "/(tabs)/(agenda)/event-details",
			params: { event: JSON.stringify(event) },
		})
	}

	return (
		<View style={styles.container}>
			<View style={styles.head}>
				<Text style={styles.text}>
					En esta sección podrás ver una lista de citas en las que has reservado y
					asistido.
				</Text>
				<Text style={styles.text}>
					Presiona sobre una para ver más detalles o cancelar una cita agendada.
				</Text>
			</View>

			{loading ? (
				<LoadingIndicator />
			) : data?.formatted.length === 0 ? (
				<View style={{ alignItems: "center", justifyContent: "center", height: "70%" }}>
					<Text style={{ fontSize: 16, fontWeight: "semibold" }}>
						No tienes citas agendadas.
					</Text>
				</View>
			) : (
				<FlatList
					data={data?.formatted}
					numColumns={1}
					style={styles.flatList}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<SelectableItem
							title={item?.service?.name ?? "Servicio no encontrado"}
							subtitle={dayjs(item.start).format("DD/MM/YYYY - HH:mm A")}
							imageUri={`/services/${item.service?.id}.webp`}
							onPress={() => handleEventPress(item)}
						/>
					)}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		margin: 15,
		borderRadius: 15,
		padding: 20,
		backgroundColor: "white",
		gap: "5%",
	},
	flatList: {
		width: "100%",
		borderRadius: 15,
	},
	contentContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	column: {
		marginVertical: 5,
		justifyContent: "space-between",
		gap: 15,
	},
	head: {
		width: "100%",
		gap: 15,
	},
	text: {
		fontWeight: "semibold",
		fontSize: 16,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
})

export default AgendaTab
