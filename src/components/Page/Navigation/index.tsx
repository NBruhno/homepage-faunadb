import Link from 'next/link'
import { useState } from 'react'

import { config } from 'config.client'

import { useRefresh } from 'reducers/refresh'

import { useStore } from 'lib/store'

import { ButtonIcon } from 'components/Buttons'
import { LightDarkModeIcon } from 'components/Icons'

import { Header } from './Header'
import { Placeholder } from './Placeholder'
import { NavLink } from './NavLink'
import { MenuAnchor } from './MenuAnchor'
import { Menu } from './Menu'
import { MenuItem } from './MenuItem'

export const Navigation = (props: React.ComponentProps<'nav'>) => {
	const { user } = useRefresh()
	const [showMenu, setShowMenu] = useState(false)
	const { state, dispatch } = useStore()

	return (
		<>
			<Header {...props}>
				<Link href='/' passHref>
					<NavLink>Home</NavLink>
				</Link>
				<Link href='/login' passHref>
					<NavLink>Login</NavLink>
				</Link>

				<MenuAnchor
					onClick={() => setShowMenu(!showMenu)}
					onMouseEnter={() => setShowMenu(true)}
					onMouseLeave={() => setShowMenu(false)}
				>
					<NavLink>Projects</NavLink>
					<Menu isOpen={showMenu}>
						<MenuItem>
							<Link href='/games' passHref>
								<NavLink>Games</NavLink>
							</Link>
						</MenuItem>
						<MenuItem>
							<Link href='/test' passHref>
								<NavLink>Test</NavLink>
							</Link>
						</MenuItem>
						<MenuItem>
							<Link href='/tests' passHref>
								<NavLink>Projects</NavLink>
							</Link>
						</MenuItem>
						<MenuItem>
							<NavLink href={config.environment === 'development' ? 'http://localhost:9000' : `/storybook/index.html`}>
								Storybook
							</NavLink>
						</MenuItem>
					</Menu>
				</MenuAnchor>
				<NavLink>
					{user ? <div>{user.email}</div> : <div>Loading user...</div>}
				</NavLink>
				<ButtonIcon
					aria-label='theme switch'
					label={<LightDarkModeIcon />}
					onClick={() => dispatch({ darkTheme: !state.darkTheme })}
				/>
			</Header>
			<Placeholder />
		</>
	)
}
