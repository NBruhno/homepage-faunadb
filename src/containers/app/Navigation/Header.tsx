/* eslint-disable jsx-a11y/anchor-has-content */
import { forwardRef } from 'react'

export const Header = forwardRef((props: React.ComponentPropsWithRef<'a'>, ref) => {
	const forwardRef = ref as React.RefObject<HTMLAnchorElement>

	return (
		<a
			css={(theme: Theme) => ({
				alignItems: 'center',
				backgroundColor: theme.color.sidebarBackground,
				color: theme.darkTheme ? theme.color.text : theme.color.textInverted,
				display: 'flex',
				flexShrink: 0,
				fontFamily: theme.fontFamily.poppins,
				height: '35px',
				padding: '12px 24px',
				textDecoration: 'none',
				width: 'auto',
			})}
			{...props}
			ref={forwardRef}
		/>
	)
})
