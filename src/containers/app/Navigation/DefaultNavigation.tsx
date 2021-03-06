import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuth } from 'states/auth'

import { HomeIcon, UserIcon, UserOffIcon, InfoIcon, AppsIcon, ListNumberIcon, ListCheckIcon, ListSearchIcon } from 'components/Icons'
import { Placeholder } from 'components/Placeholder'

import { NavLink } from '../NavLink'

import { ButtonAuthenticate } from './Buttons/Authenticate'
import { Content } from './Content'
import { Separator } from './Separator'
import { Text } from './Text'

type Props = {
	collapsedSidebar: boolean,

	closeMenuOnInteraction: () => void,
}

export const DefaultNavigation = ({ closeMenuOnInteraction, collapsedSidebar }: Props) => {
	const { user } = useAuth()
	const { pathname } = useRouter()

	return (
		<Content css={{ paddingTop: '12px' }}>
			<Link href='/' passHref>
				<NavLink active={pathname === '/'} onClick={() => closeMenuOnInteraction()}>
					<HomeIcon title='Home' css={{ marginRight: '12px' }} size={22} /><Text>Home</Text>
				</NavLink>
			</Link>
			<Link href='/users/profile' passHref>
				<NavLink active={pathname.includes('/users/profile')} onClick={() => closeMenuOnInteraction()}>
					{user.accessToken
						? <UserIcon title='Profile' css={{ marginRight: '12px' }} size={22} />
						: <UserOffIcon title='Unauthorized' css={{ marginRight: '12px' }} size={22} />}
					<Placeholder isLoading={!user.isStateKnown}>
						<Text>{user.accessToken ? user.displayName : 'Not logged in'}</Text>
					</Placeholder>
				</NavLink>
			</Link>
			<ButtonAuthenticate />
			<Separator collapsed={collapsedSidebar}>
				Games
			</Separator>
			<Link href='/games/popular' passHref>
				<NavLink active={pathname.includes('/games/popular')} onClick={() => closeMenuOnInteraction()}>
					<ListNumberIcon title='Games' css={{ marginRight: '12px' }} size={22} /><Text>Popular</Text>
				</NavLink>
			</Link>
			<Link href='/games/following' passHref>
				<NavLink active={pathname.includes('/games/following')} onClick={() => closeMenuOnInteraction()}>
					<ListCheckIcon title='Games' css={{ marginRight: '12px' }} size={22} /><Text>Following</Text>
				</NavLink>
			</Link>
			<Link href='/games/search' passHref>
				<NavLink active={pathname.includes('/games/search')} onClick={() => closeMenuOnInteraction()}>
					<ListSearchIcon title='Games' css={{ marginRight: '12px' }} size={22} /><Text>Search</Text>
				</NavLink>
			</Link>
			<Separator collapsed={collapsedSidebar}>
				Other
			</Separator>
			<Link href='/projects' passHref>
				<NavLink active={pathname.includes('/projects')} onClick={() => closeMenuOnInteraction()}>
					<AppsIcon title='Projects' css={{ marginRight: '12px' }} size={22} /><Text>Projects</Text>
				</NavLink>
			</Link>
			<Link href='/about' passHref>
				<NavLink active={pathname.includes('/about')} onClick={() => closeMenuOnInteraction()}>
					<InfoIcon title='About' css={{ marginRight: '12px' }} size={22} /><Text>About</Text>
				</NavLink>
			</Link>
		</Content>
	)
}
