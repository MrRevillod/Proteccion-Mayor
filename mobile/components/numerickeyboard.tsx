import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Colors from "@/components/colors"

type NumericKeyboardProps = {
    onNumberPress: (number: string) => void
    onDeletePress: () => void
}

const NumericKeyboard = ({ onNumberPress, onDeletePress }: NumericKeyboardProps) => {
    return (
        <View style={styles.keyboard}>
            {[...Array(10)].map((_, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.key}
                    onPress={() => onNumberPress(index.toString())}
                >
                    <Text style={styles.keyText}>{index}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.key} onPress={onDeletePress}>
                <Text style={styles.keyText}>←</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NumericKeyboard

const styles = StyleSheet.create({
    keyboard: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: 300,
    },
    key: {
        width: 80,
        height: 80,
        margin: 10,
        backgroundColor: Colors.green,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    keyText: {
        fontSize: 24,
        color: Colors.white,
    },
})
