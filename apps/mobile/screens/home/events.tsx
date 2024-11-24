import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request"
import { useRoute } from "@react-navigation/native"
import DateTimePicker from '@react-native-community/datetimepicker'
import AppText from "@/components/appText"
import { Picker } from "@react-native-picker/picker"
import LoadingScreen from "@/components/loadingScreen"

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
    { name: "Enero", value: 0 },
    { name: "Febrero", value: 1 },
    { name: "Marzo", value: 2 },
    { name: "Abril", value: 3 },
    { name: "Mayo", value: 4 },
    { name: "Junio", value: 5 },
    { name: "Julio", value: 6 },
    { name: "Agosto", value: 7 },
    { name: "Septiembre", value: 8 },
    { name: "Octubre", value: 9 },
    { name: "Noviembre", value: 10 },
    { name: "Diciembre", value: 11 }
]

export const Pill = ({ text }: { text: string }) => {
    return (
        <View style={styles.datePill}>
            <AppText style={{ textAlign: "center" }}>{text}</AppText>
        </View>
    )
}

const EventScreen = ({ navigation }: any) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [events, setEvents] = useState<any[]>([])
    const [date, setDate] = useState(new Date())
    const [month, setMonth] = useState((new Date()).getMonth())
    const [perDay, setPerDay] = useState(0)
    const [loading, setLoading] = useState(false)

    const [showPicker, setShowPicker] = useState(false)

    const route = useRoute()
    const { serviceId, centerId } = route.params as { serviceId: number, centerId: number }


    useEffect(() => {
        if (perDay) {
            mostrarEventos(date, "day")
        } else {
            mostrarEventos(month, "month")
        }
    }, [])


    const mostrarEventos = async (currentDate: Date | number, typeDate: "day" | "month") => {
        setLoading(true)
        setIsLoaded(false)
        try {

            const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/events/${serviceId}/${centerId}`, "GET")
            if (response?.data) {
                const eventList = response.data.events as Event[]
                let eventos = new Array<Event>()
                if (typeDate === "day" && typeof currentDate === "object") {
                    eventList.map((event) => {
                        const startDate = new Date(event.start)
                        if (startDate.getDate() === currentDate.getDate() && startDate.getMonth() === currentDate.getMonth()) {
                            eventos.push(event)
                        }
                    })

                }
                else {
                    eventList.map((event) => {
                        const startDate = new Date(event.start)
                        if (startDate.getMonth() === currentDate) {
                            eventos.push(event)
                        }
                    })
                }

                setEvents(eventos)

            } else {
                throw new Error("No data")
            }
        } catch (error) {
            console.error("Error fetching centers:", error)
        }
        setIsLoaded(true)
        setLoading(false)
    }

    return (
        <>
            {loading && <LoadingScreen />}
            <GeneralView title="Agendar Servicio">
                <View style={styles.bigContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.textStyle}>Seleccionar Hora</Text>

                    </View>
                    <View style={styles.dateContainer}>

                        {showPicker && perDay &&
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="calendar"
                                style={{
                                    backgroundColor: Colors.green,
                                }}

                                onChange={async (event, selectedDate) => {
                                    setShowPicker(false)
                                    const currentDate = selectedDate || date
                                    setDate(currentDate)
                                    await mostrarEventos(currentDate, "day")
                                }}

                            />}

                        {perDay ?
                            <>
                                <CustomButton title="Por Mes" onPress={() => {
                                    setPerDay(0)
                                    mostrarEventos(month, "month")
                                }} style={{ paddingHorizontal: 15 }} />
                                <CustomButton title={date.toLocaleDateString()} onPress={() => setShowPicker(true)} textStyle={{ color: Colors.green }}
                                    style={{ paddingHorizontal: 10, marginEnd: 10, backgroundColor: "white", borderColor: Colors.green, borderWidth: 1 }}
                                />
                            </>
                            : <>
                                <CustomButton title="Por Día" onPress={() => {
                                    setPerDay(1)
                                    mostrarEventos(date, "day")
                                }} style={{ paddingHorizontal: 15 }} />
                                <Picker
                                    mode="dialog"
                                    selectedValue={month}

                                    onValueChange={async (value) => {
                                        const currentMonth = value as number
                                        setMonth(currentMonth)
                                        await mostrarEventos(currentMonth, "month")

                                    }}
                                    dropdownIconColor={Colors.green}
                                    dropdownIconRippleColor={Colors.green}
                                    style={{ width: "60%", color: Colors.green }}
                                >
                                    {selectValues.map((value, i) => {
                                        if (value.value >= (new Date()).getMonth()) {
                                            return <Picker.Item key={value.value} label={value.name} value={value.value} />
                                        }
                                    })}
                                </Picker>
                            </>
                        }

                        <AppText style={{ opacity: 0.5 }} extra={-3}> Presione para seleccionar fecha</AppText>
                    </View>

                    <ScrollView style={styles.midContainer}>
                        {isLoaded && events.length > 0 ? events.map((event) => {
                            const startDate = new Date(event.start)
                            const endDate = new Date(event.end)
                            return (
                                <TouchableOpacity key={event.id} onPress={() => navigation.navigate("Hours", { event })} style={{ margin: 3 }}>
                                    {!perDay ? <Pill text={startDate.toLocaleDateString() + "  " + startDate.toLocaleTimeString().slice(0, 5) + " - " + endDate.toLocaleTimeString().slice(0, 5)} /> :
                                        <Pill text={startDate.toLocaleTimeString().slice(0, 5) + " - " + endDate.toLocaleTimeString().slice(0, 5)} />}
                                </TouchableOpacity>)
                        }) : <AppText style={{ opacity: 0.6 }} extra={-4}>No hay eventos para esta fecha</AppText>}
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
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
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
