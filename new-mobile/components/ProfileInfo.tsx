import React, { ComponentProps } from "react"

import { FontAwesome } from "@expo/vector-icons"
import { View, Text, StyleSheet } from "react-native"

interface ProfileInfoProps {
    iconName: ComponentProps<typeof FontAwesome>["name"]
    title: string
    data?: string
}

const ProfileInfo = ({ iconName, title, data }: ProfileInfoProps) => {
    const styles = StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            gap: 25,
            alignItems: "center",
        },
        iconContainer: {
            width: "15%",
            justifyContent: "center",
            alignItems: "center",
        },
        secondaryContainer: {
            width: "80%",
            flexDirection: "column",
            gap: 10,
        },
    })

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <FontAwesome name={iconName} style={{ fontSize: 40 }} />
            </View>
            <View style={styles.secondaryContainer}>
                <Text style={{ fontWeight: "600", fontSize: 20 }}>{title}</Text>
                {data && <Text style={{}}>{data}</Text>}
            </View>
        </View>
    )
}

export default ProfileInfo