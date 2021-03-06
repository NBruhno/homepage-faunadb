import type { NextApiRequest, NextApiResponse } from 'next'

import { createMocks } from 'node-mocks-http'
import {
	parseJson, parseHeaders, testingCredentials, expectStatusCode, expectSpecificObject, accessTokenMatch,
	refreshTokenMatch, transaction,
} from 'test/utils'

import { decodeJwtToken } from 'lib/decodeJwtToken'
import { logger } from 'lib/logger'

import { ApiError } from '../errors/ApiError'

import { login } from './login'
import { user } from './user'
import { users } from './users'

describe('/api/users', () => {
	beforeAll(async () => {
		const { req: loginReq, res: loginRes } = createMocks<NextApiRequest, NextApiResponse>({
			method: 'POST',
			body: {
				email: 'mail+testregister@bruhno.dev',
				password: testingCredentials,
			},
		})

		await login(loginReq, loginRes, { transaction }).then(async () => {
			const { userId } = decodeJwtToken(parseJson(loginRes).accessToken)
			const { req: deleteReq, res: deleteRes } = createMocks<NextApiRequest, NextApiResponse>({
				method: 'DELETE',
				headers: {
					authorization: `Bearer ${parseJson(loginRes).accessToken}`,
				},
				body: {
					email: 'mail+testregister@bruhno.dev',
					password: testingCredentials,
				},
			})

			await user(deleteReq, deleteRes, { userId, transaction }).catch((error: unknown) => logger.debug(error))
		}).catch((error) => logger.debug(error))
	})

	test('POST › Register successfully', async () => {
		const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
			method: 'POST',
			body: {
				email: 'mail+testregister@bruhno.dev',
				password: testingCredentials,
				displayName: 'Test register',
			},
		})

		await users(req, res, { transaction })
		expectStatusCode(res, 200)
		expect(parseJson(res).accessToken).toMatch(accessTokenMatch)
		expect(parseHeaders(res)['set-cookie']).toMatch(refreshTokenMatch)
	})

	test('POST › Register already existing email', async () => {
		const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
			method: 'POST',
			body: {
				email: 'mail+test@bruhno.dev',
				password: testingCredentials,
				displayName: 'Test already exist register',
			},
		})

		await expect(users(req, res, { transaction })).rejects.toThrow(ApiError)
		expectStatusCode(res, 400)
		expectSpecificObject(res, { error: 'Email is already in use' })
	})

	test('POST › Invalid body', async () => {
		const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
			method: 'POST',
		})

		await expect(users(req, res, { transaction })).rejects.toThrow(ApiError)
		expectStatusCode(res, 400)
		expectSpecificObject(res, { error: ApiError.fromCode(400).message })
	})

	test('Invalid method', async () => {
		const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
			method: 'TRACE',
		})

		await expect(users(req, res, { transaction })).rejects.toThrow(ApiError)
		expectStatusCode(res, 405)
		expectSpecificObject(res, { error: ApiError.fromCode(405).message })
	})
})
