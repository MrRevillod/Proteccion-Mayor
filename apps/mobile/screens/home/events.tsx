import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Button, SectionList, ScrollView } from "react-native"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import DataDisplayer from "@/components/dataDisplayer"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request" // Usa tu función de petición
import { useRoute } from "@react-navigation/native" // Para obtener parámetros de navegación
import { Picker } from '@react-native-picker/picker'
type Event = {
    id: number,
    start: string,
    end: string,
    assistance: boolean,
    createdAt: string,
    updatedAt: string,
    seniorId: string,
    professionalId: string,
    centerId: number,
    serviceId: number
}

const selectValues = [
    { name: "Enero", value: 1 },
    { name: "Febrero", value: 2 },
    { name: "Marzo", value: 3 },
    { name: "Abril", value: 4 },
    { name: "Mayo", value: 5 },
    { name: "Junio", value: 6 },
    { name: "Julio", value: 7 },
    { name: "Agosto", value: 8 },
    { name: "Septiembre", value: 9 },
    { name: "Octubre", value: 10 },
    { name: "Noviembre", value: 11 },
    { name: "Diciembre", value: 12 }
]

const EventScreen = ({ navigation }: any) => {
    const [events, setEvents] = useState<any[]>([])
    const [month, setMonth] = useState(1)
    const route = useRoute()
    const { serviceId, centerId } = route.params as { serviceId: number, centerId: number }

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/events/${serviceId}/${centerId}`, "GET")
                if (response?.data) {
                    const eventList = response.data.events as Event[]
                    setEvents(eventList)
                }
            } catch (error) {
                console.error("Error fetching centers:", error)
            }
        }

        if (serviceId) {
            fetchCenters()
        }
    }, [serviceId])

    return (
        <>
            <GeneralView title="Agendar Servicio    ">
                <View style={styles.bigContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.textStyle}>Seleccionar Hora</Text>
                    </View>
                    <ScrollView style={styles.midContainer}>
                        {events.map((event) => {
                            const startDate = new Date(event.start)
                            return (
                                <TouchableOpacity
                                    key={event.id}
                                    onPress={() => navigation.navigate("Hours", { event })}>
                                    <DataDisplayer
                                        titleField={startDate.toLocaleDateString()}
                                        descriptionField={startDate.toLocaleTimeString()}
                                        imgPath={{ uri: `${SERVER_URL}/api/storage/public/services/${event.serviceId}.webp` }} />
                                </TouchableOpacity>)
                        })
                        }
                    </ScrollView>
                    <View style={styles.bottomContainer}></View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                    <CustomButton title="Volver" onPress={() => navigation.navigate("Home")} style={{ width: "40%", borderRadius: 20 }} />
                    <CustomButton title="Siguiente" onPress={() => navigation.navigate("Home")} style={{ width: "40%", borderRadius: 20 }} />
                </View>
            </GeneralView>
            <MenuBar navigation={navigation} />
        </>
    )
}

export default EventScreen

const styles = StyleSheet.create({
    subHead: {
        display: "flex",
        flexDirection: "row"

    },
    bigContainer: {
        height: "80%",
        borderRadius: 20,
    },
    topContainer: {
        backgroundColor: Colors.green,
        height: "10%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    midContainer: {
        height: "85%",
        width: "100%",
        backgroundColor: Colors.white,
        borderColor: Colors.green,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20

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
    textStyle: {
        color: "white",
        fontSize: 18,
    },
})
