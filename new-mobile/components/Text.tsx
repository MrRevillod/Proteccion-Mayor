import React from "react"
import { Text as ReactText, TextProps } from "react-native"

export const Text: React.FC<TextProps> = (props) => {
	return <ReactText {...props} allowFontScaling={false} />
}
