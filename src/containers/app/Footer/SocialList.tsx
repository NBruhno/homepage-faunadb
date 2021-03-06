export const SocialList = (props: React.ComponentProps<'ul'>) => (
	<ul
		css={{
			display: 'inline-flex',
			verticalAlign: 'middle',
			margin: '0 0 8px 0',
			padding: 0,
			listStyle: 'none',
		}}
		{...props}
	/>
)
