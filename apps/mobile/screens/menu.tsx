import React from "react"
import { StyleSheet } from "react-native"
import { commonProps } from "@/utils/types"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"

const Menu = ({ navigation }: commonProps) => {
    return (
        <GeneralView title="Bienvenido" textTitle="¿Es su primera vez usando Protección Mayor?">
            <CustomButton title="Si" onPress={() => navigation.navigate("Register")} style={{ marginTop: 20, width: "85%", alignSelf: "center" }} />
            <CustomButton
                title="No"
                style={{ backgroundColor: Colors.white, borderColor: Colors.green, borderWidth: 2, width: "85%", alignSelf: "center", marginTop: 20 }}
                textStyle={styles.customButtonText}
                onPress={() => navigation.navigate("Login")}
            />
            <CustomButton
                title="Mi Perfil"
                onPress={() => navigation.navigate("Profile")}
                style={{ marginTop: 20, width: "85%", alignSelf: "center" }}
            />
            <CustomButton
                title="Nueva Foto de Perfil"
                onPress={() => navigation.navigate("NewProfile")}
                style={{ marginTop: 20, width: "85%", alignSelf: "center" }}
            />
            <CustomButton
                title="Cambiar tamaño de fuente"
                onPress={() => navigation.navigate("FontSize")}
                style={{ marginTop: 20, width: "85%", alignSelf: "center" }}
            />
        </GeneralView>
    )
}

export default Menu

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    customButtonText: {
        color: Colors.green,
    },
})
