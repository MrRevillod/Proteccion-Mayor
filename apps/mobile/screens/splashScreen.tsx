import Colors from "@/components/colors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native"

const pmLogo = require("@/assets/images/pmLogo.png")
const tcoLogo = require("@/assets/images/tcoLogo.png")

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        const checkFirstTime = async () => {
            const firstTime = await AsyncStorage.getItem("firstTime")
            if (firstTime === null) {
                // First time opening the app
                await AsyncStorage.setItem("firstTime", "false")
                navigation.replace("Menu")
            } else {
                // Not the first time
                navigation.replace("Login")
            }
        }
        checkFirstTime()
    }, [navigation])

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.logoContainer}>
                    <View style={styles.pmLogo}>
                        <Image source={pmLogo} style={styles.image} />
                    </View>
                    <Text style={styles.text}>Protección Mayor</Text>
                </View>
                <ActivityIndicator size="large" color={Colors.white} />
                <View style={styles.tcoLogo}>
                    <Image source={tcoLogo} style={styles.image} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.green,
        height: "100%",
    },
    innerContainer: {
        position: "absolute",
        top: "30%",
        height: "70%",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logoContainer: {
        width: "55%",
        height: "25%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    pmLogo: {
        width: "30%",
        height: "55%",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    text: {
        color: Colors.white,
        fontSize: 24,
        maxWidth: "70%",
    },
    tcoLogo: {
        width: "30%",
        height: "15%",
        marginBottom: "10%",
    },
});

export default SplashScreen;
