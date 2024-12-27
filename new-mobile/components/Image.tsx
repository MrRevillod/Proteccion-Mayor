import React from "react"

import { API_BASE_URL } from "@/lib/http"
import { Image as ExpoImage } from "expo-image"

interface ImageProps {
	source: string
	cache?: boolean
	style: any
}

export const Image: React.FC<ImageProps> = ({ source, style, cache }) => {
	const uri = `${API_BASE_URL}/storage/public${source}`
	return <ExpoImage source={uri} style={style} cachePolicy={cache ? "memory" : undefined} />
}
