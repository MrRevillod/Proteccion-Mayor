import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Button, SectionList, ScrollView } from "react-native"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request" // Usa tu función de petición
import { useRoute } from "@react-navigation/native" // Para obtener parámetros de navegación
import DateTimePicker from '@react-native-community/datetimepicker'
import AppText from "@/components/appText"



export type Event = {
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
    service: {
        name: string, color: string,
    },
    center: {
        id: number, name: string,
    },
    senior: {
        id: string, name: string,
    },
    professional: { name: string },
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

export const Pill = ({ text }: { text: string }) => {
    return (
        <View style={styles.datePill}>
            <AppText style={{ textAlign: "center" }}>{text}</AppText>
        </View>
    )
}
const EventScreen = ({ navigation }: any) => {
    const [events, setEvents] = useState<any[]>([])
    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)

    const route = useRoute()
    const { serviceId, centerId } = route.params as { serviceId: number, centerId: number }




    const mostrarEventos = async (currentDate: Date) => {
        try {
            const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/events/${serviceId}/${centerId}`, "GET")
            if (response?.data) {
                const eventList = response.data.events as Event[]
                if (eventList.length === 0) {
                    alert("No hay eventos disponibles para esta fecha")
                    return
                } else {
                    let eventos = new Array<Event>()
                    eventList.map((event) => {
                        const startDate = new Date(event.start)
                        if (startDate.getDate() === currentDate.getDate() && startDate.getMonth() === currentDate.getMonth()) {
                            eventos.push(event)
                        }
                    })
                    if (eventos.length === 0) {
                        alert("No hay eventos disponibles para esta fecha")
                        return
                    }
                    setEvents(eventos)
                    setShowPicker(false)
                }
            } else {
                throw new Error("No data")
            }
        } catch (error) {
            console.error("Error fetching centers:", error)
        }


    }

    return (
        <>
            <GeneralView title="Agendar Servicio">
                <View style={styles.bigContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.textStyle}>Seleccionar Hora</Text>

                    </View>
                    <View style={styles.dateContainer}>

                        {showPicker &&

                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="calendar"
                                style={{
                                    backgroundColor: Colors.green,

                                }}
                                onChange={async (event, selectedDate) => {
                                    const currentDate = selectedDate || date
                                    setDate(currentDate)
                                    await mostrarEventos(currentDate)
                                }} />}
                        {
                            events.length > 0 ?
                                <CustomButton title={date.toLocaleDateString()} onPress={() => setShowPicker(true)} />
                                :
                                <CustomButton title="Seleccionar Fecha" onPress={() => setShowPicker(true)} />
                        }

                        <AppText style={{ opacity: 0.5 }} extra={-3}> Presione para seleccionar fecha</AppText>
                    </View>
                    <ScrollView style={styles.midContainer}>
                        {events.length > 0 && events.map((event) => {
                            const startDate = new Date(event.start)
                            const endDate = new Date(event.end)
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate("Hours", { event })}>
                                    <Pill text={startDate.toLocaleTimeString().slice(0, 5) + " - " + endDate.toLocaleTimeString().slice(0, 5)} />
                                </TouchableOpacity>)
                        })}
                    </ScrollView>
                    <View style={styles.bottomContainer}>

                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                    <CustomButton title="Volver" onPress={() => navigation.navigate("Centers", { serviceId })} style={{ width: "40%", borderRadius: 20 }} />
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
        overflow: "hidden"
    },

    topContainer: {
        backgroundColor: Colors.green,
        height: "10%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
        justifyContent: "center",

    },
    dateContainer: {
        height: "20%",
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: Colors.green,
        padding: 10,


    },
    midContainer: {
        height: "45%",
        width: "100%",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        // same as date container
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: Colors.green,

    },
    bottomContainer: {
        backgroundColor: Colors.green,
        minHeight: "5%",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    textStyle: {
        color: "white",
        fontSize: 18,
    },
    datePill: {
        display: "flex",
        alignItems: "center",
        borderColor: Colors.green,
        borderWidth: 1,
        borderRadius: 20,
        padding: 5,

    }
})
