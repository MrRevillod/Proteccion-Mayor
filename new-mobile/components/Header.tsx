import { FontAwesome } from "@expo/vector-icons"
import { primaryGreen } from "@/constants/Colors"
import { useNavigation } from "@react-navigation/native"
import { Platform, StyleSheet, TouchableOpacity, View, Text } from "react-native"

interface HeaderProps {
    title: string
    goBack?: () => void
    height?: number
}

export const Header = ({ title, goBack, height }: HeaderProps) => {
    const navigation = useNavigation()
    const canGoBack = navigation.canGoBack()

    return (
        <View style={[s.header, { paddingTop: Platform.OS === "ios" ? 50 : 0, height: height ?? 150 }]}>
            {goBack && canGoBack && (
                <TouchableOpacity onPress={goBack}>
                    <FontAwesome size={28} name="arrow-left" style={{ fontSize: 20, color: "white" }} />
                </TouchableOpacity>
            )}
            <View style={s.headerTitleContainer}>
                <Text style={s.headerTitle}>{title}</Text>
            </View>
            {goBack && canGoBack && <FontAwesome size={28} name="arrow-left" style={{ fontSize: 20, color: primaryGreen }} />}
        </View>
    )
}

const s = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: primaryGreen,
        color: "#fff",
        paddingHorizontal: 45,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#fff",
    },
})
