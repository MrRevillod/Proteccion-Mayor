import React from "react"

import { primaryGreen } from "@/constants/Colors"
import { StyleSheet, Text, TouchableOpacity } from "react-native"

interface ButtonProps {
    text: string
    variant: "primary" | "secondary" | "tertiary" | "quaternary"
    bg?: "#046c4e" | "#fff"
    onPress: () => void
    size?: `${number}%`
}

export const Button = ({ text, onPress, variant, size = "80%" }: ButtonProps) => {
    const style = {
        primary: {
            button: styles.primaryButton,
            text: styles.buttonText,
        },
        secondary: {
            button: styles.secondaryButton,
            text: styles.secondaryButtonText,
        },
        tertiary: {
            button: styles.tertiaryButton,
            text: styles.tertiaryButtonText,
        },
        quaternary: {
            button: styles.tertiaryButton,
            text: styles.buttonText,
        },
    }

    return (
        <TouchableOpacity style={[styles.button, style[variant].button, { width: size }]} onPress={onPress}>
            <Text style={style[variant].text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    primaryButton: {
        backgroundColor: primaryGreen,
    },
    secondaryButton: {
        backgroundColor: "#fff",
    },
    tertiaryButton: {
        borderWidth: 2,
        borderColor: "#d4d3cf",
        backgroundColor: "transparent",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    secondaryButtonText: {
        color: primaryGreen,
        fontSize: 18,
        fontWeight: "bold",
    },
    tertiaryButtonText: {
        color: primaryGreen,
        fontSize: 16,
        fontWeight: "bold",
    },
})
