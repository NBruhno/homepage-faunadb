import { useEffect } from 'react'
import { useField } from 'react-final-form'

import { FieldWrapper } from '../FieldWrapper'
import { Hint } from '../Hint'
import { LabelContainer } from '../LabelContainer'
import { RowLabel } from '../RowLabel'

import { CheckboxComponent } from './CheckboxComponent'
import { CheckMark } from './CheckMark'

type Props = {
	label: string,
	name: string,

	disabled?: boolean,
	fullWidth?: boolean,
	hint?: string,
	id?: string,

	format?: (value: any, name: string) => any,
	parse?: (value: any, name: string) => any,
}

export const Checkbox = ({
	parse = (value) => value || false, fullWidth = true,
	label, hint, disabled = false, name, format, id = name,
}: Props) => {
	const { input, meta } = useField(
		name,
		{
			type: 'text',
			parse,
			format,
		},
	)

	useEffect(() => {
		if (input.value === undefined || input.value === '') {
			input.onChange(false)
		}
	})

	return (
		<FieldWrapper fullWidth={fullWidth}>
			<RowLabel htmlFor={id}>
				<CheckMark checked={input.value} disabled={disabled} focus={Boolean(meta?.active)} />
				<LabelContainer css={{ margin: '0 0 0 6px' }}>
					<div>{label}</div>
					{hint && <Hint>{hint}</Hint>}
				</LabelContainer>
				<CheckboxComponent
					{...input}
					checked={input.value || false}
					id={id}
					type='checkbox'
					disabled={disabled}
				/>
			</RowLabel>
		</FieldWrapper>
	)
}
