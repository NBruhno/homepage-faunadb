import { useEffect } from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import { useField } from 'react-final-form'

import useUnique from 'lib/useUnique'

import LabelContainer from '../LabelContainer'
import FieldWrapper from '../FieldWrapper'
import ColumnLabel from '../ColumnLabel'
import InputError from '../InputError'
import Hint from '../Hint'

import MenuAnchor from './MenuAnchor'
import validators from './validators'
import MenuItem from './MenuItem'
import Select from './Select'
import Menu from './Menu'

type Props = {
	name: string,
	label: string,
	hint?: string,
	multiple?: boolean,
	validate?: boolean,
	required?: boolean,
	disabled?: boolean,
	fullWidth?: boolean,
	placeholder?: string,
	optionsLimit?: number,
	optionalHint?: boolean,
	enableValidate?: boolean,
	renderLabel?: React.ReactNode,
	parse?: (value: any, name: string) => any,
	format?: (value: any, name: string) => any,
	options: { label: string, value: any, disabled?: boolean }[],
}

const itemToString = (item: any) => (item || '')

export const SelectComponent = ({
	optionalHint = true, fullWidth = true, required = false, enableValidate = true,
	disabled, name, format, parse = (value) => value || null, label,
	hint, placeholder, multiple, options,
}: Props) => {
	const parseDefault = (value: any) => value || (multiple ? [] : null)

	const id = useUnique(name)
	const { input, meta } = useField(
		name,
		{
			type: 'select',
			parse: parse || parseDefault,
			format,
			allowNull: true,
			validate: (!disabled && enableValidate && validators) ? validators({ required, multiple }) : null,
		},
	)

	useEffect(() => {
		if (input.value === undefined) {
			input.onChange(multiple ? [] : '')
		}
	}, [])

	const hasError = meta.submitFailed && Boolean(meta.error)

	return (
		<Downshift
			{...input}
			id={id}
			itemToString={itemToString}
			selectedItem={input.value}
			onInputValueChange={(inputValue) => {
				input.onChange(inputValue)
			}}
		>
			{({ getInputProps, getItemProps, getMenuProps, getRootProps, getLabelProps, isOpen, inputValue, highlightedIndex, selectedItem }) => {
				const filteredOptions = matchSorter(options, inputValue, { keys: ['label'] })
				return (
					<FieldWrapper fullWidth={fullWidth} minWidth={170} {...getRootProps({ refKey: 'forwardRef' })} {...getLabelProps()}>
						<ColumnLabel htmlFor={id}>
							<LabelContainer>
								<div>{label} {optionalHint && !required && <Hint>(Optional)</Hint>}</div>
								{hint && <Hint>{hint}</Hint>}
							</LabelContainer>
							<MenuAnchor>
								<Select {...getInputProps({ name: input.name, placeholder })} onFocus={input.onFocus} onBlur={input.onBlur} hasError={hasError} disabled={disabled} id={id} />
								<Menu hasError={hasError} {...getMenuProps({ refKey: 'forwardRef' })} isOpen={isOpen && Boolean(filteredOptions.length)}>
									{filteredOptions.map(({ value, label }, index: number) => (
										<MenuItem {...getItemProps({ key: value, index, item: value })} highlightedIndex={highlightedIndex} selectedItem={selectedItem}>
											{label}
										</MenuItem>
									))}
								</Menu>
							</MenuAnchor>
							<InputError hasError={hasError} errorMessage={meta.error} isFocus={meta.active} />
						</ColumnLabel>
					</FieldWrapper>
				)
			}}
		</Downshift>
	)
}

export default SelectComponent
