import supertest from 'supertest'
import { testingCredentials, createTestServer } from 'test/utils'

import handler from 'pages/api/users/[id]/logout'
import login from 'pages/api/users/login'

import { decodeJwtToken } from 'lib/decodeJwtToken'

import { ApiError } from 'api/errors'

let accessToken = null as unknown as string
let userId = null as unknown as string
describe('/api/users/logout', () => {
	beforeAll(async () => {
		const server = createTestServer(login)
		const res = await supertest(server)
			.post('/api/users/login')
			.send({
				email: 'mail+test@bruhno.dev',
				password: testingCredentials,
			})

		accessToken = res.body.accessToken
		userId = decodeJwtToken(res.body.accessToken).userId
		server.close()
	})

	test('POST › Logout', async () => {
		expect.hasAssertions()
		const server = createTestServer(handler, { userId })
		const res = await supertest(server)
			.post(`/api/users/${userId}/logout`)
			.set('authorization', `Bearer ${accessToken}`)

		expect(res.status).toBe(200)
		expect(res.body).toStrictEqual({ message: 'You have been logged out successfully' })
		server.close()
	})

	test('POST › Logout already logged out session', async () => {
		expect.hasAssertions()
		const server = createTestServer(handler, { userId })
		const res = await supertest(server)
			.post(`/api/users/${userId}/logout`)
			.set('authorization', `Bearer ${accessToken}`)

		expect(res.status).toBe(200)
		expect(res.body).toStrictEqual({ message: 'Your local session has been terminated but found no active server session' })
		server.close()
	})

	test('POST › User does not exist', async () => {
		expect.hasAssertions()
		const server = createTestServer(handler, { userId: '1234' })
		const res = await supertest(server)
			.post(`/api/users/${1234}/logout`)
			.set('authorization', `Bearer ${accessToken}`)

		expect(res.status).toBe(200)
		expect(res.body).toStrictEqual({ message: 'Your local session has been terminated but found no active server session' })
		server.close()
	})

	test('POST › Not authenticated', async () => {
		expect.hasAssertions()
		const server = createTestServer(handler, { userId })
		const res = await supertest(server)
			.post(`/api/users/${userId}/logout`)

		expect(res.status).toBe(401)
		expect(res.body).toStrictEqual({ message: ApiError.fromCode(401).message })
		server.close()
	})

	test('POST › Invalid query', async () => {
		expect.hasAssertions()
		const server = createTestServer(handler)
		const res = await supertest(server)
			.post(`/api/users/./changePassword`)
			.set('authorization', `Bearer ${accessToken}`)

		expect(res.status).toBe(400)
		expect(res.body.message).toMatch(/Expected an object/)
		server.close()
	})

	test('Invalid method', async () => {
		expect.hasAssertions()
		const server = createTestServer(handler, { userId })
		const res = await supertest(server)
			.get(`/api/users/${userId}/logout`)

		expect(res.status).toBe(405)
		expect(res.body).toStrictEqual({ message: ApiError.fromCode(405).message })
		server.close()
	})
})