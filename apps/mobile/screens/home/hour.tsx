import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Button, SectionList, ScrollView, Alert } from "react-native"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import DataDisplayer from "@/components/dataDisplayer"
import GeneralView from "@/components/generalView"
import MenuBar from "@/components/menuBar"
import { makeAuthenticatedRequest, SERVER_URL } from "@/utils/request" // Usa tu función de petición
import { useRoute } from "@react-navigation/native" // Para obtener parámetros de navegación
import { Picker } from '@react-native-picker/picker'
import events from "./events"
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


const HourScreen = ({ navigation }: any) => {
    const route = useRoute()
    const { event } = route.params as { event: Event }

    const startDate = new Date(event.start)
    const endDate = new Date(event.end)
    const reserveEvent = async () => {
        try {
            const response = await makeAuthenticatedRequest(`${SERVER_URL}/api/dashboard/events/${event.id}/reservate`, "PATCH")
            if (response?.status === 200) {
                // Mostrar alerta de reserva agendada
                Alert.alert("Reserva agendada", "Tu reserva ha sido agendada correctamente", [{ text: "OK", onPress: () => navigation.navigate("Home") }])
            }
        } catch (error) {
            console.error("Error reservando evento:", error)
            Alert.alert("Error", "Hubo un error al reservar tu evento, por favor intenta de nuevo")
        }
    }
    return (
        <>
            <GeneralView title="Agendar Servicio    ">
                <View style={styles.bigContainer}>
                    <View style={styles.topContainer}>
                        <Text style={styles.textStyle}>Confirmar</Text>
                    </View>
                    <View style={styles.midContainer}>
                        <View style={styles.subHead}>
                            <Text style={styles.card}>Fecha: {startDate.toLocaleDateString()}</Text>
                            <Text style={styles.card}>Hora: {startDate.toLocaleTimeString()}</Text>
                            <Text style={styles.card}>Duración: {Math.abs(startDate.getTime() - endDate.getTime()) / 36e5} horas</Text>
                            <CustomButton title="Reservar" onPress={reserveEvent} style={{ width: "50%", borderRadius: 10, marginTop: 25 }} />

                        </View>
                    </View>

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

export default HourScreen

const styles = StyleSheet.create({
    card: {
        fontSize: 15,
        fontWeight: "bold",
        borderColor: Colors.green,
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        margin: 3,
    },
    subHead: {
        paddingTop: 10,
        justifyContent: "center",
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
