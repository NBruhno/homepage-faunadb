export const ListItem = (props: React.ComponentProps<'li'>) => (
	<li
		css={(theme: Theme) => ({
			marginRight: '12px',
			borderRight: `1px solid ${theme.color.gray050}`,
			paddingRight: '12px',
			display: 'inline-flex',

			'&:last-child': {
				borderRight: 'none',
			},
		})}
		{...props}
	/>
)
