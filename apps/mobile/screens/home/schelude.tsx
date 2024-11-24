import React, { useCallback, useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, FlatList } from "react-native"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request"
import { getStorageRUT } from "@/utils/storage"
import DataDisplayer from "@/components/dataDisplayer"
import { formatDate } from "@/utils/formatter"
import LoadingScreen from "@/components/loadingScreen"
import { useFocusEffect } from "@react-navigation/native"

const { width } = Dimensions.get("window")

interface Event {
	id: number
	assistance: number
	createdAt: string
	updateAt: string
	service: {
		name: string
		color: string
	}
	center: {
		id: number
		name: string
		address: string
	}
	senior: object
	professional: object
	start: string
	end: string
}

const Schedule = ({ navigation }: any) => {
	const [eventsList, setEventsList] = useState<Event[]>([])
	const [selectedButton, setSelectedButton] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(false)
	const slideAnim = new Animated.Value(0)

	const fetchEvents = async () => {
		setLoading(true)
		const rut = await getStorageRUT()
		if (!rut) {
			setLoading(false)
			return
		}
		makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/events?seniorId=${rut}`, "GET").then((response) => {
			if (response?.data) {
				const eventsList = response.data.values.formatted
				setEventsList(eventsList)
			}
		})
		setLoading(false)
	}

	useFocusEffect(
		useCallback(() => {
			fetchEvents()
		}, [])
	)

	// Función para manejar la animación del deslizador
	const handlePress = (index: number) => {
		setSelectedButton(index)

		// Animar el deslizador hacia el botón seleccionado
		Animated.timing(slideAnim, {
			toValue: index === 0 ? 0 : width * 0.5,
			duration: 300,
			useNativeDriver: true,
		}).start()
	}

	// Filtrar eventos según el botón seleccionado
	const filteredEvents = eventsList.filter((event) => (selectedButton === 0 ? !event.assistance : event.assistance))

	// Renderizar cada evento
	const renderEvent = ({ item }: { item: Event }) => {
		const date = formatDate(item.start)
		const concatString = date + "\n" + item.center.name
		return <DataDisplayer actionButton="Más..." titleField={item.service.name} descriptionField={concatString}
			event={{ bool: true, color: item.service.color }} onPress={() => navigation.navigate("HourInfo", { event: item })} />
	}

	return (
		<>
			{loading && <LoadingScreen />}
			<GeneralView title="Agenda" noBorders>
				<View style={styles.bigContainer}>
					<View style={styles.buttonsContainer}>
						<Animated.View style={[styles.slider, { transform: [{ translateX: slideAnim }] }]} />

						<TouchableOpacity style={[styles.button, selectedButton === 0 && styles.buttonActive]} onPress={() => handlePress(0)}>
							<Text style={[styles.buttonText, selectedButton === 0 && styles.buttonTextActive]}>Próximas Horas</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.button, selectedButton === 1 && styles.buttonActive]} onPress={() => handlePress(1)}>
							<Text style={[styles.buttonText, selectedButton === 1 && styles.buttonTextActive]}>Horas Finalizadas</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.midContainer}>
						{filteredEvents.length > 0 ? (
							<FlatList data={filteredEvents} keyExtractor={(item) => item.id.toString()} renderItem={renderEvent} />
						) : (
							<Text style={styles.noEventsText}>Usted aún no ha reservado horas</Text>
						)}
					</View>
					<View style={styles.bottomContainer}></View>
				</View>
			</GeneralView>
			<MenuBar navigation={navigation} />
		</>
	)
}

export default Schedule

const styles = StyleSheet.create({
	bigContainer: {
		height: "86%",
	},
	buttonsContainer: {
		flexDirection: "row",
		height: "10%",
		borderColor: Colors.green,
		borderWidth: 2,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: "hidden",
		margin: 0,
		padding: 0,
	},
	midContainer: {
		height: "86%",
		borderColor: Colors.green,
		borderLeftWidth: 2,
		borderRightWidth: 2,
		padding: 10,
	},
	bottomContainer: {
		backgroundColor: Colors.green,
		height: "5%",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
	button: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.white,
	},
	buttonActive: {
		backgroundColor: Colors.green,
	},
	buttonText: {
		fontSize: 16,
		color: Colors.green,
		fontWeight: "600",
	},
	buttonTextActive: {
		color: Colors.white,
	},
	slider: {
		position: "absolute",
		width: "50%",
		height: "100%",
		backgroundColor: Colors.green,
	},
	eventItem: {
		padding: 10,
		marginBottom: 10,
		backgroundColor: Colors.green,
		borderRadius: 10,
	},
	eventText: {
		fontSize: 14,
		color: Colors.black,
	},
	noEventsText: {
		textAlign: "center",
		marginTop: 20,
		fontSize: 20,
		color: Colors.gray,
	},
})
