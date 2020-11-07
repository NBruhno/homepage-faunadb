import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import { useAuth } from 'states/auth'
import { useModal } from 'states/modal'
import { useResponsive } from 'states/responsive'

import { screenSizes } from 'styles/theme'

import { Footer } from '../Footer'

import { MainContent } from './MainContent'
import { Modal } from './Modal'
import { Shade } from './Shade'

const FormLogin = dynamic(async () => {
	const module = await import('components/Forms/Login')
	return module.FormLogin
}, { ssr: false })

const protectedRoutes = [
	'/users/profile',
]

const roleProtectedRoutes = [
	'/users',
]

export const Main = ({ children }: React.ComponentProps<'main'>) => {
	const { showLogin, updateResponsive } = useResponsive()
	const { openModal, closeModal } = useModal()
	const { user } = useAuth()
	const isMobile = useMediaQuery({ maxWidth: screenSizes.mobile - 1 })
	const isTablet = useMediaQuery({ maxWidth: screenSizes.tablet - 1, minWidth: screenSizes.mobile })
	const isLaptop = useMediaQuery({ maxWidth: screenSizes.laptop - 1, minWidth: screenSizes.tablet })
	const collapsedSidebar = useMediaQuery({ maxWidth: screenSizes.laptop - 1 })
	const [protectRoute, setProtectRoute] = useState(false)
	const [roleProtectRoute, setRoleProtectRoute] = useState(false)
	const { pathname } = useRouter()

	useEffect(() => {
		closeModal()
		if (user.isStateKnown) {
			if (!user.accessToken && (protectedRoutes.includes(pathname) || roleProtectedRoutes.includes(pathname))) {
				setProtectRoute(true)
			} else if (user.accessToken && roleProtectedRoutes.includes(pathname) && user.role !== 'owner') {
				setRoleProtectRoute(true)
			} else if (protectRoute) {
				setProtectRoute(false)
			} else if (roleProtectRoute) {
				setRoleProtectRoute(false)
			}
		}
	}, [pathname, user.isStateKnown, user.role])

	useEffect(() => {
		updateResponsive({ isMobile, isTablet, isLaptop, collapsedSidebar })
	}, [isMobile, collapsedSidebar])

	useEffect(() => {
		if (protectRoute || roleProtectRoute || showLogin) {
			openModal((
				<>
					{!user.accessToken ? (
						<>
							{show && <FormLogin />}
						</>
					) : (
						<>
							<h1 css={{ margin: '0 0 24px', fontSize: '1.5em' }}>You are not authorized to access this resource</h1>
							<Link href='/' passHref><a css={(theme: Theme) => ({ color: theme.color.text })}>Home</a></Link>
						</>
					)}
				</>
			), { allowClosure: !protectRoute || !roleProtectRoute, onClose: () => updateResponsive({ showLogin: !showLogin }) })
		}
	}, [protectRoute, roleProtectRoute, showLogin])

	const show = (protectRoute || roleProtectRoute || showLogin) ?? false

	return (
		<MainContent>
			{children}
			<Modal />
			<Shade />
			<Footer />
		</MainContent>
	)
}
