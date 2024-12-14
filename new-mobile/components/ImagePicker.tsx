import * as ImagePicker from "expo-image-picker"

import { Button } from "@/components/Button"
import { Controller, useFormContext } from "react-hook-form"
import { View, Image, Text, StyleSheet } from "react-native"

interface UploadImageProps {
    label: string
    name: string
    text: string
}

export const UploadImage = ({ label, name, text }: UploadImageProps) => {
    const { control } = useFormContext()

    const pickImage = async (onChange: (value: string) => void) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status === "granted") {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: "images",
                allowsEditing: false,
                quality: 0.6,
            })

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri
                onChange(uri)
            }
        } else {
            alert("Permiso de cámara denegado")
        }
    }

    return (
        <Controller
            control={control}
            name={name}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
                <View style={styles.container}>
                    <Text style={styles.label}>{label}</Text>
                    {value ? <Image source={{ uri: value }} style={styles.image} /> : null}
                    <Button variant="primary" text={text} onPress={() => pickImage(onChange)} />
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
})