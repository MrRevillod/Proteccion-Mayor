import { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import Feather from "@expo/vector-icons/Feather"
import { useFormContext, Controller } from "react-hook-form" // Importamos useFormContext y Controller
import GoBackButton from "@/components/goBack"

const DNI = ({ navigation, route }: any) => {
    const [isCapturingFront, setIsCapturingFront] = useState<boolean>(true)
    const [arePhotosValid, setPhotosValid] = useState<boolean>(false)

    const { setValue, getValues, trigger, control, formState: { errors } } = useFormContext() // Usamos useFormContext para obtener los métodos necesarios

    useEffect(() => {
        if (route.params?.photoUri) {
            if (isCapturingFront) {
                setValue("dni_a", route.params.photoUri) // Setea la foto frontal
            } else {
                setValue("dni_b", route.params.photoUri) // Setea la foto trasera
            }
        }
    }, [route.params?.photoUri])

    useEffect(() => {
        const photos = getValues(["dni_a", "dni_b"])
        if (photos[0] && photos[1]) {
            setPhotosValid(true) // Si ambas fotos están presentes, actualiza el estado de validación
        }
    }, [getValues(["dni_a", "dni_b"])])

    const openCamera = (type: "front" | "back") => {
        navigation.navigate("Camera", { from: "DNI" }) // Navega a la cámara
    }

    const validatePhotosAndNavigate = async () => {
        const isValid = await trigger(["dni_a", "dni_b"]) // Dispara la validación de las fotos
        if (isValid) {
            navigation.navigate("Social") // Si es válido, navega a la siguiente pantalla
        }
    }

    return (
        <>
            <GoBackButton navigation={navigation} visible />
            <GeneralView
                title="Datos del Registro"
                textCircle="5/7"
                textTitle="Sube tu Cédula de Identidad por ambos lados"
                textDescription="La imagen debe ser legible y el documento debe estar vigente."
            >
                <View>
                    {/* Controlador para la foto frontal */}
                    <Controller
                        control={control}
                        name="dni_a"
                        render={({ field: { value } }) => (
                            <View style={styles.takePhotoContainer}>
                                <View style={{ width: "10%" }}>
                                    {value ? <Feather name="check-square" size={30} color="green" /> : <Feather name="square" size={30} color="black" />}
                                </View>
                                <CustomButton
                                    style={{ width: "85%" }}
                                    title={value ? "Re-tomar Foto Frontal" : "Tomar Foto Frontal"}
                                    onPress={() => {
                                        setIsCapturingFront(true)
                                        openCamera("front")
                                    }}
                                />
                            </View>
                        )}
                    />
                    {errors["dni_a"] && (
                        <Text style={{ color: "red", alignSelf: "center" }}>
                            {typeof errors["dni_a"].message === "string" ? errors["dni_a"].message : "Error en el campo DNI A"}
                        </Text>
                    )}
                    {/* Controlador para la foto trasera */}
                    <Controller
                        control={control}
                        name="dni_b"
                        render={({ field: { value } }) => (
                            <View style={styles.takePhotoContainer}>
                                <View style={{ width: "10%" }}>
                                    {value ? <Feather name="check-square" size={30} color="green" /> : <Feather name="square" size={30} color="black" />}
                                </View>
                                <CustomButton
                                    style={{ width: "85%" }}
                                    title={value ? "Re-tomar Foto Trasera" : "Tomar Foto Trasera"}
                                    onPress={() => {
                                        setIsCapturingFront(false)
                                        openCamera("back")
                                    }}
                                />
                            </View>
                        )}
                    />
                    {errors["dni_b"] && (
                        <Text style={{ color: "red", alignSelf: "center" }}>
                            {typeof errors["dni_b"].message === "string" ? errors["dni_b"].message : "Error en el campo DNI A"}
                        </Text>
                    )}

                    <>
                        {arePhotosValid ? (
                            <CustomButton title="Siguiente" onPress={validatePhotosAndNavigate} style={{ marginTop: 30 }} />
                        ) : (
                            <CustomButton
                                style={{ backgroundColor: Colors.white, marginTop: 30 }}
                                textStyle={styles.customButtonText}
                                title="Siguiente"
                                onPress={validatePhotosAndNavigate}
                            />
                        )}
                    </>

                </View>
            </GeneralView>
        </>
    )
}

export default DNI

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    customButtonText: {
        color: Colors.green,
    },
    takePhotoContainer: {
        flexDirection: "row",
        padding: 5,
        marginTop: 25,
        justifyContent: "space-between",
        alignItems: "center",
    },
})
