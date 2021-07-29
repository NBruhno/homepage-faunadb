import { useAuth } from 'states/users'

import { Title, Subtitle } from 'containers/login'

import { ButtonSolid, ButtonBorder } from 'components/Buttons'

import { Input } from './Fields/Input'

import { Form } from '.'

export const FormLogin = () => {
	const { login, register, verify2fa, logout, currentFlow, setCurrentFlow } = useAuth()

	switch (currentFlow) {
		case 'login': return (
			<>
				<Title>Welcome back</Title>
				<Form form={currentFlow} onSubmit={async (fields) => { await login(fields) }}>
					<Input label='Email' name='email' type='email' id={`${currentFlow}-email`} required autoComplete='email' />
					<Input label='Password' name='password' type='password' id={`${currentFlow}-password`} required autoComplete='password' />
					<div css={(theme) => ({
						display: 'flex',
						justifyContent: 'space-between',

						[theme.mediaQueries.maxMobile]: {
							flexDirection: 'column-reverse',
						},
					})}
					>
						<ButtonBorder label='Sign up instead' onClick={() => setCurrentFlow('register')} />
						<ButtonSolid
							label='Login'
							submit
							css={(theme) => ({
								[theme.mediaQueries.maxMobile]: {
									width: '100%',
									marginBottom: '12px',
								},
							})}
						/>
					</div>
				</Form>
			</>
		)
		case 'register': return (
			<>
				<Title>Sign up</Title>
				<Form form={currentFlow} onSubmit={async (fields) => { await register(fields) }}>
					<Input label='Access code' name='accessCode' type='password' id={`${currentFlow}-accessCode`} required />
					<Input label='Email' name='email' type='email' id={`${currentFlow}-email`} required autoComplete='email' />
					<Input label='Display name' name='displayName' id={`${currentFlow}-displayName`} required autoComplete='username' />
					<Input label='Password' name='password' type='password' id={`${currentFlow}-password`} required autoComplete='password' />
					<div css={(theme) => ({
						display: 'flex',
						justifyContent: 'space-between',

						[theme.mediaQueries.maxMobile]: {
							flexDirection: 'column-reverse',
						},
					})}
					>
						<ButtonBorder label='Go back' onClick={() => setCurrentFlow('login')} />
						<ButtonSolid
							label='Sign up'
							submit
							css={(theme) => ({
								[theme.mediaQueries.maxMobile]: {
									width: '100%',
									marginBottom: '12px',
								},
							})}
						/>
					</div>
				</Form>
			</>
		)
		case '2fa': return (
			<>
				<Title>Two-Factor Authentication</Title>
				<Subtitle>Submit your code generated by your authenticator</Subtitle>
				<Form form={currentFlow} onSubmit={async (fields) => { await verify2fa(fields) }}>
					<Input label='One time password' name='otp' id={`${currentFlow}-otp`} required autoComplete='otp' />
					<ButtonSolid label='Verify code' submit fullWidth />
				</Form>
			</>
		)
		case 'loggedIn': return (
			<div>
				<Title>You are already logged in</Title>
				<Subtitle />
				<ButtonSolid label='Logout' onClick={async () => { await logout() }} fullWidth />
			</div>
		)
		default: return null
	}
}
