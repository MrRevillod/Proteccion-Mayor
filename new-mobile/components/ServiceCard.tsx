import { Service } from "@/lib/types"
import { API_BASE_URL } from "@/lib/http"
import { TouchableOpacity, Image, StyleSheet, View, Text } from "react-native"

interface ServiceCardProps {
    service: Service
    onPress: () => void
}

export const ServiceCard = ({ service, onPress }: ServiceCardProps) => {
    const imageUri = `${API_BASE_URL}/storage/public/services/${service.id}.webp`

    return (
        <TouchableOpacity style={{ ...styles.gridItem, backgroundColor: service.color }} onPress={onPress}>
            <View style={[styles.iconContainer]}>
                <Image source={{ uri: imageUri }} style={styles.iconImage} resizeMode="cover" />
            </View>
            <Text style={styles.serviceText}>{service.name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    gridItem: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        margin: 10,
        paddingBottom: 10,
        width: 150,
        height: 170,
    },
    iconContainer: {
        width: 150,
        height: 150,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    iconImage: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: 150,
        height: 150,
    },
    serviceText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginVertical: 5,
    },
})