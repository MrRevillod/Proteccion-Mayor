import { BadRequest } from "@repo/lib"

type ReturnTypes = Record<string, any> | undefined

export const parseSelectString = (select?: string, validFields?: readonly string[]): ReturnTypes => {
	if (!select) return undefined
	return select.split(",").reduce(
		(acc, curr) => {
			if (validFields && !validFields.includes(curr)) {
				throw new BadRequest(`Invalid select field: ${curr}`)
			}

			acc[curr] = true
			return acc
		},
		{} as Record<string, boolean>,
	)
}
