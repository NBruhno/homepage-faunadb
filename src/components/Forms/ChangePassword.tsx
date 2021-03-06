import { useAuth } from 'states/auth'

import { Title, Subtitle } from 'containers/login'

import { ButtonSolid } from 'components/Buttons'

import { Input } from './Fields/Input'

import { Form } from '.'

export const FormChangePassword = () => {
	const { changePassword } = useAuth()
	const formName = 'changePassword'

	return (
		<>
			<Title>Change password</Title>
			<Subtitle />
			<Form form={formName} onSubmit={async (fields) => { await changePassword(fields) }} resetFormOnSubmitSuccess>
				<Input label='New password' name='newPassword' type='password' id={`${formName}-newPassword`} required />
				<ButtonSolid label='Change password' submit fullWidth />
			</Form>
		</>
	)
}
