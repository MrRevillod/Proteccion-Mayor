import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { useFormContext } from "react-hook-form"
import { commonProps } from "@/utils/types"
import GoBackButton from "@/components/goBack"

const Pin = ({ navigation }: commonProps) => {
    // Accedemos al contexto del formulario
    const { control, formState: { errors }, trigger } = useFormContext()


    const handleSubmit = async () => {
        const isValid = await trigger("pin")
        if (isValid) {
            navigation.navigate("ConfirmPin")
        }

    }
    return (
        <>
            <GoBackButton navigation={navigation} visible />
            <GeneralView
                title="Datos del Registro"
                textCircle="3/7"
                textTitle="Ingrese su Pin de 4 dígitos."
                textDescription="Su pin no debe repetir números, ni usar secuencias (1234). Además, debe ser un pin que recuerde fácilmente."
            >
                <View style={styles.container}>
                    <Input
                        name="pin"
                        placeholder="Ingrese su pin aquí"
                        control={control}
                        errors={errors}
                        secureTextEntry
                        keyboardType="number-pad"
                    />
                    <CustomButton title="Siguiente" onPress={handleSubmit} />
                    <CustomButton
                        style={{ backgroundColor: Colors.white }}
                        textStyle={styles.customButtonText}
                        title="Volver"
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </GeneralView>
        </>
    )
}

export default Pin

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    customButtonText: {
        color: Colors.green,
    },
})
