import React, { createContext, useState, useContext, ReactNode } from "react"

interface FontSizeContextProps {
	fontSize: number
	changeFontSize: (size: number) => void
}

const FontSizeContext = createContext<FontSizeContextProps | undefined>(undefined)

interface FontSizeProviderProps {
	children: ReactNode
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
	const [fontSize, setFontSize] = useState<number>(16)

	const changeFontSize = (size: number) => {
		setFontSize(size)
	}

	return <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>{children}</FontSizeContext.Provider>
}

export const useFontSize = (): FontSizeContextProps => {
	const context = useContext(FontSizeContext)
	if (!context) {
		throw new Error("useFontSize must be used within a FontSizeProvider")
	}
	return context
}
