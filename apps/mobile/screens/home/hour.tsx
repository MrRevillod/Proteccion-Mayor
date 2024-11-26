import React, { useState } from "react"
import { View, Text, StyleSheet, Alert, Image } from "react-native"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request" // Usa tu función de petición
import { useRoute } from "@react-navigation/native" // Para obtener parámetros de navegación
import AppText from "@/components/appText"
import { Event } from "./events"
import Pill from "@/components/pill"
import LoadingScreen from "@/components/loadingScreen"

const HourScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState<boolean>(false)
    const route = useRoute()
    const { event } = route.params as { event: Event }

    const startDate = new Date(event.start)
    const endDate = new Date(event.end)

    const reserveEvent = async () => {
        setLoading(true)
        try {
            const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/events/${event.id}/reservate`, "PATCH", navigation, false)
            if (response?.status === 200) {
                // Mostrar alerta de reserva agendada
                Alert.alert("Reserva agendada", "Tu reserva ha sido agendada correctamente", [{ text: "OK", onPress: () => navigation.navigate("Home") }])
            }
        } catch (error) {
            console.error("Error reservando evento:", error)
            Alert.alert("Error", "Hubo un error al reservar tu evento, por favor intenta de nuevo")
        } finally {
            setLoading(false)
        }
    }

    const formatEndDate = (date: string) => {
        const formatted = date.slice(0, 5).split(":")[0]
        return formatted ? formatted : date.slice(0, 5)
    }

    return (
        <>
            {loading && <LoadingScreen />}
            <GeneralView title="Agendar Servicio">
                <View style={styles.bigContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.textStyle}>Confirmar</Text>
                    </View>

                    <View style={styles.midContainer}>
                        <View style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                            <AppText extra={5} style={{ fontWeight: "600", color: Colors.green }}>{event.service.name}</AppText>
                        </View>
                        <Image
                            source={{ uri: `${SERVER_URL}/api/storage/public/services/${event.serviceId}.webp` }}
                            resizeMode="cover"
                            style={{ width: 100, height: 100, alignSelf: "center", borderRadius: 100, marginBottom: 10 }}
                        />
                        <View style={{ display: "flex", gap: 10 }}>
                            <Pill align={"flex-start"} text={`Fecha: ${startDate.toLocaleDateString()}`} />
                            <Pill align={"flex-start"} text={`Hora de inicio: ${startDate.toLocaleTimeString().slice(0, 5)}`} />
                            <Pill align={"flex-start"} text={`Hora de término: ${formatEndDate(endDate.toLocaleTimeString())}`} />

                        </View>
                    </View>
                    <View style={styles.dateContainer}>
                        <CustomButton title="Reservar" onPress={reserveEvent} style={{ width: "50%", borderRadius: 10 }} />
                    </View>
                    <View style={styles.bottomContainer}></View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                    <CustomButton title="Volver" onPress={() => navigation.navigate("Events", { serviceId: event.serviceId, centerId: event.centerId })} style={{ width: "40%", borderRadius: 20 }} />
                </View>
            </GeneralView>
            <MenuBar navigation={navigation} />
        </>
    )
}

export default HourScreen

const styles = StyleSheet.create({

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
        display: "flex",
        alignItems: "center",
        height: "15%",
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: Colors.green,
        padding: 10,


    },
    midContainer: {

        height: "65%",
        width: "100%",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        // same as date container
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: Colors.green,
        paddingVertical: 10,

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
})
