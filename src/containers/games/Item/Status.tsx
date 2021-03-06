export const Status = (props: React.ComponentProps<'span'>) => (
	<span
		css={(theme: Theme) => ({
			backgroundColor: theme.darkTheme ? theme.color.grayDark : theme.color.grayDarker,
			borderRadius: '4px',
			fontSize: theme.fontSize.s80,
			fontFamily: theme.fontFamily.roboto,
			padding: '3px 6px',
		})}
		{...props}
	/>
)
