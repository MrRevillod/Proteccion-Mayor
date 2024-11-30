import Colors from "@/components/colors"
import React from "react"
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native"

const LoadingScreen = () => {

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.green} />
            <Text style={styles.text}>Cargando...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        height: "100%",
    },
    text: {
        color: Colors.black,
        fontSize: 18,
        maxWidth: "100%",
        textAlign: "center",
        marginTop: "5%",
    }
})

export default LoadingScreen;
