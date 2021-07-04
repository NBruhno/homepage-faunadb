import type { Props as AsyncProps } from './Async'

import { adjustHsl } from 'lib/adjustHsl'

import { ButtonAsync } from './Async'

type Props = {
	backgroundColor?: keyof Theme['color'],
	color?: keyof Theme['color'],
} & AsyncProps

export const Solid = ({ color, backgroundColor, ...rest }: Props) => (
	<ButtonAsync
		css={(theme) => ({
			backgroundColor: backgroundColor ? theme.color[backgroundColor] : theme.color.primary,
			borderRadius: '4px',
			color: color ? theme.color.textInverted : theme.color.black,

			'&:disabled': {
				color: theme.color.gray040,
				backgroundColor: theme.color.gray020,
			},

			'&:hover:enabled': {
				backgroundColor: adjustHsl(theme.color.primary, { light: '60%' }),
			},
		})}
		{...rest}
	/>
)
