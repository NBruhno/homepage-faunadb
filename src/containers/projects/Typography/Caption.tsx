export const Caption = (props: React.ComponentProps<'p'>) => (
	<p
		css={(theme: Theme) => ({
			opacity: 0.7,
			fontSize: theme.fontSize.s90,
			textAlign: 'center',
			margin: '6px 0 42px',
		})}
		{...props}
	/>
)
