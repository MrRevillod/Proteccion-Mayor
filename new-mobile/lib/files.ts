export const imageUriToFile = (name: string, uri: string) => {
	return {
		uri,
		type: "image/webp",
		name: `${name}.webp`,
	}
}
