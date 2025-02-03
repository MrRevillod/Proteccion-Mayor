import clsx from "clsx"
import React from "react"
import { Select } from "antd"
import { Dispatch, SetStateAction } from "react"
import { Controller, useFormContext } from "react-hook-form"

interface SuperSelectProps {
    name: string
    label: string
    options: any
    defaultValue?: any
    placeholder?: string
    disabled?: boolean
    allowClear?: boolean
    setSearch?: Dispatch<SetStateAction<string>>
    showSearch?: boolean
    onChange?: (value: any, option: any) => void
    errorAlign?: "horizontal" | "vertical"
}

export const SuperSelect = ({ name, label, ...props }: SuperSelectProps) => {
    const {
        options,
        setSearch,
        placeholder,
        disabled = false,
        allowClear = true,
        showSearch = true,
        defaultValue,
        onChange,
        errorAlign = "horizontal",
    } = props

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const classes = clsx(
        errors[name] ? "border-red" : "border-gray-dark",
        "rounded-lg text-sm focus:outline-none focus:ring-primary-green",
        "focus:border-primary-green h-10 placeholder-neutral-400",
        "text-dark dark:text-light mb-1 border-1 bg-light dark:bg-primary-dark",
        "w-full",
    )

    const clientFilterFn = (input: string, option: any) => {
        return (option?.label as string).toLowerCase().includes(input.toLowerCase())
    }

    const filterOption = setSearch ? false : clientFilterFn

    return (
        <div className="flex flex-col gap-3">
            <div className={clsx(
                errorAlign === "horizontal" && "flex gap-2 flex-row items-center justify-between",
                errorAlign === "vertical" && "flex flex-col gap-2",

            )}>
                <label className="font-semibold dark:text-light text-dark truncate overflow-hidden whitespace-nowrap">
                    {label}
                </label>
                {errors[name] && <div className="text-red text-sm">{errors[name]?.message?.toString()}</div>}
            </div>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select
                        {...field}
                        defaultValue={defaultValue}
                        value={field.value}
                        className={classes}
                        showSearch={showSearch}
                        placeholder={placeholder ? placeholder : `Seleccione una opción`}
                        options={options}
                        filterOption={filterOption}
                        onSearch={(value) => {
                            setSearch && setSearch(value)
                        }}
                        onChange={onChange || ((value) => { field.onChange(value) })}
                        allowClear={allowClear}
                        disabled={disabled}
                    />
                )}
            />
        </div>
    )
}
