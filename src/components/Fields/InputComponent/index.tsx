import { useField } from 'react-final-form'

import { useUnique } from 'lib/useUnique'

import { LabelContainer } from '../LabelContainer'
import { FieldWrapper } from '../FieldWrapper'
import { ColumnLabel } from '../ColumnLabel'
import { InputError } from '../InputError'
import { Hint } from '../Hint'

import { HintContainer } from './HintContainer'
import { validators } from './validators'
import { Textarea } from './Textarea'
import { Input } from './Input'

type InputProps = {
	name: string,
	label: string,
	hint?: string,
	rows?: number,
	type?: string,
	maxRows?: number,
	pattern?: string,
	validate?: boolean,
	required?: boolean,
	disabled?: boolean,
	minLength?: number,
	maxLength?: number,
	autofocus?: boolean,
	fullWidth?: boolean,
	placeholder?: string,
	autoComplete?: string,
	optionalHint?: boolean,
	enableValidate?: boolean,
	parse?: (value: any, name: string) => any,
	format?: (value: any, name: string) => any,
}

export const InputComponent = ({
	optionalHint = true, fullWidth = true, required = false, rows = 3, enableValidate = true, type = 'text',
	disabled, maxRows, minLength, maxLength, name, format, validate, autoComplete = 'off',
	parse = (value) => value || null, label, hint, placeholder, autofocus, pattern,
}: InputProps) => {
	const { input, meta } = useField(
		name,
		{
			type,
			parse,
			format,
			allowNull: true,
			validate: (!disabled && enableValidate && validators) ? validators({ required, validate, type }) : null,
		},
	)

	const id = useUnique(name)
	const hasError = meta.submitFailed && Boolean(meta.error)

	const defaultProps = {
		value: input.value || '',
		autoFocus: autofocus,
		id,
		placeholder,
		disabled,
		hasError,
		minLength,
		maxLength,
		autoComplete,
		pattern,
	}

	if (type === 'hidden') {
		return <input {...input} {...defaultProps} />
	}

	return (
		<FieldWrapper fullWidth={fullWidth} minWidth={170}>
			<ColumnLabel>
				<LabelContainer>
					<HintContainer>
						<div>
							<label htmlFor={id}>{label} {optionalHint && !required && <Hint>(Optional)</Hint>}</label>
							{hint && <Hint>{hint}</Hint>}
						</div>
						{maxLength && <Hint htmlFor={id}> {(input.value && input.value.length) || 0} / {maxLength}</Hint>}
					</HintContainer>
				</LabelContainer>
				{type === 'multiline' ? (
					<Textarea
						{...input}
						{...defaultProps}
						rows={rows}
						maxRows={maxRows}
						async
					/>
				) : (
					<Input
						{...input}
						{...defaultProps}
					/>
				)}
				<InputError hasError={hasError} errorMessage={meta.error} isFocus={meta.active} />
			</ColumnLabel>
		</FieldWrapper>
	)
}