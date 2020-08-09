type Props = {
	show: boolean,
} & React.ComponentProps<'div'>

export const Container = ({ show, children, ...rest }: Props) => (
	<div
		css={(theme: Theme) => ({
			top: '15vh',
			left: 0,
			right: 0,
			display: 'flex',
			opacity: show ? 1 : 0,
			pointerEvents: 'none',
			position: 'absolute',
			zIndex: 5,

			transition: `opacity 135ms ${theme.animation.default}`,
		})}
		{...rest}
	>
		<div
			css={{
				display: 'flex',
				margin: 'auto',
				maxWidth: '100%',
				padding: '24px',
				pointerEvents: show ? 'auto' : 'none',
				width: '450px',
			}}
		>
			{children}
		</div>
	</div>
)
