import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
	0% { opacity: 0; }
`

export const Error = (props: React.ComponentProps<'div'>) => (
	<div
		css={(theme) => ({
			alignItems: 'center',
			animation: `${fadeIn} 0.2s`,
			display: 'flex',
			flexDirection: 'column',
			fontSize: theme.fontSize.s80,
			justifyContent: 'center',
			minHeight: '200px',
			opacity: 0.6,
		})}
		{...props}
	/>
)
