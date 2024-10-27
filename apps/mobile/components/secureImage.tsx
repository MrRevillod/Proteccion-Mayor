import { STORAGE_KEY } from "@/utils/storage"
import React from "react"
import FastImage from "react-native-fast-image"

const SecureImage = ({ uri }: { uri: string }) => (
	<FastImage
		style={{ width: 100, height: 100 }}
		source={{
			uri: uri,
			headers: { Authorization: "STORAGE_KEY_SECRET" },
			priority: FastImage.priority.normal,
		}}
		resizeMode={FastImage.resizeMode.cover}
	/>
)

export default SecureImage
