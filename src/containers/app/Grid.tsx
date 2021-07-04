import type { ComponentProps } from 'react'

export const Grid = (props: ComponentProps<'div'>) => (
	<div
		css={(theme) => ({
			backgroundColor: theme.color.background,
			display: 'grid',
			gridTemplateColumns: 'auto 1fr',
			gridTemplateRows: '1fr',
			maxWidth: '100vw',
			minHeight: '100vh',
			position: 'relative',

			[theme.mediaQueries.maxMobile]: {
				gridTemplateColumns: '1fr',
				gridTemplateRows: 'auto 1fr',
			},
		})}
		{...props}
	/>
)
