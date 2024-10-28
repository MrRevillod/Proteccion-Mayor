import { View, StyleSheet } from "react-native"
import Input from "@/components/input"
import GeneralView from "@/components/generalView"
import CustomButton from "@/components/button"
import Colors from "@/components/colors"
import { useFormContext } from "react-hook-form" // Importamos useFormContext
import GoBackButton from "@/components/goBack"

const ConfirmPin = ({ navigation }: any) => {
    const { control, formState: { errors }, trigger } = useFormContext()

    const handleSubmit = async () => {
        const isValid = await trigger("pinConfirm")
        if (isValid) {
            navigation.navigate("DNI")
        }

    }
    return (
        <>
            <GoBackButton navigation={navigation} visible />

            <GeneralView
                title="Datos del Registro"
                textCircle="4/7"
                textTitle="Vuelva a ingresar su Pin."
                textDescription="Antes de confirmar su pin, asegúrese de que le sea fácil de recordar."
            >
                <View style={styles.container}>
                    <Input name="pinConfirm"
                        placeholder="Confirme su Pin"
                        control={control}
                        errors={errors}
                        secureTextEntry
                        keyboardType="number-pad"
                    />
                    <CustomButton title="Siguiente" onPress={handleSubmit} />

                </View>
            </GeneralView>
        </>
    )
}

export default ConfirmPin

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    customButtonText: {
        color: Colors.green,
    },
})
1