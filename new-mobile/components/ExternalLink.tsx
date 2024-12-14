import React from "react"

import { Link } from "expo-router"
import { Platform } from "react-native"
import { openBrowserAsync } from "expo-web-browser"

interface ExternalLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
	href: string
}

export const ExternalLink = (props: ExternalLinkProps) => {
	return (
		<Link
			target="_blank"
			{...props}
			// @ts-expect-error: External URLs are not typed.
			href={props.href}
			onPress={(e) => {
				if (Platform.OS !== "web") {
					e.preventDefault()
					openBrowserAsync(props.href as string)
				}
			}}
		/>
	)
}
