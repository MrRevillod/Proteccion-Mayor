import React from "react"

import { Text, TextProps, StyleSheet } from "react-native"
import { useFontSize } from "@/contexts/fontSizeContext"

interface AppTextProps extends TextProps {
    children: React.ReactNode
    extra?: number
}

const AppText: React.FC<AppTextProps> = ({ children, style, extra = 0, ...props }) => {
	const { fontSize } = useFontSize()

	return (
        <Text style={[styles.text, { fontSize: fontSize + extra }, style]} {...props}>
			{children}
		</Text>
	)
}

const styles = StyleSheet.create({
	text: {},
})

export default AppText
