export const Container = (props: React.ComponentProps<'footer'>) => (
	<footer
		css={(theme: Theme) => ({
			borderTop: `1px solid ${theme.color.border}`,
			backgroundColor: theme.color.background,
			color: theme.color.text,
			padding: '12px 24px',
			height: '72px',
			marginTop: 'auto',
			bottom: 0,
			overflow: 'hidden',
			verticalAlign: 'bottom',
		})}
		{...props}
	/>
)