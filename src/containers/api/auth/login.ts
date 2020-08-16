import { NextApiRequest, NextApiResponse } from 'next'
import { query as q, errors } from 'faunadb'

import type { User } from 'types/User'
import { TokenTypes } from 'types/Token'

import { ApiError } from '../errors/ApiError'
import { getJwtToken } from '../getJwtToken'
import { serverClient } from '../faunaClient'
import { setRefreshCookie } from '../middleware'

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body: { email, password } } = req

	switch (method) {
		case 'POST': {
			if (!email || !password) {
				const error = ApiError.fromCode(400)
				res.status(error.statusCode).json({ error: error.message })
				throw error
			}

			const { data, secret } = await serverClient.query<User>(q.Merge(
				q.Login(q.Match(q.Index('users_by_email'), email), { password }),
				q.Get(q.Match(q.Index('users_by_email'), email)),
			)).catch((faunaError) => {
				if (faunaError instanceof errors.BadRequest) {
					const error = ApiError.fromCode(401)
					res.status(error.statusCode).json({ error: 'Invalid email and/or password' })
					throw error
				} else {
					const error = ApiError.fromCode(500)
					res.status(error.statusCode).json({ error: error.message })
					throw faunaError
				}
			})

			const getRole = () => {
				switch (true) {
					case data.owner: return 'owner'
					case data.user: return 'user'
					default: return 'unknown'
				}
			}

			if (data?.twoFactorSecret) {
				const intermediateToken = getJwtToken(secret, { sub: email, displayName: data.displayName, role: getRole() }, TokenTypes.Intermediate)

				res.status(200).json({ intermediateToken })
				break
			} else {
				const accessToken = getJwtToken(secret, { sub: email, displayName: data.displayName, role: getRole() })
				const refreshToken = getJwtToken(secret, { sub: email, displayName: data.displayName, role: getRole() }, TokenTypes.Refresh)

				setRefreshCookie(res, refreshToken)

				res.status(200).json({ accessToken })
				break
			}
		}

		default: {
			const error = ApiError.fromCode(405)
			res.status(error.statusCode).json({ error: error.message })
			throw error
		}
	}
}