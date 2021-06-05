import type { Options } from '../types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { TokenTypes } from 'types/Token'
import type { User } from 'types/User'

import { query as q, errors } from 'faunadb'

import { createAndAttachError } from '../errors/ApiError'
import { serverClient } from '../faunaClient'
import { getJwtToken } from '../getJwtToken'
import { setRefreshCookie } from '../middleware'
import { monitorReturn, monitorReturnAsync } from '../performanceCheck'

interface Request extends NextApiRequest {
	body: {
		email: string,
		password: string,
	}
}

export const login = async (req: Request, res: NextApiResponse, options: Options) => {
	const { method, body: { email, password } } = req
	const { transaction } = options

	switch (method) {
		case 'POST': {
			if (!email || !password) throw createAndAttachError(400, res)

			const { data: { displayName, role, twoFactorSecret }, secret, ref } = await monitorReturnAsync(
				() => serverClient(transaction).query<User>(q.Merge(
					q.Login(q.Match(q.Index('usersByEmail'), email), { password }),
					q.Get(q.Match(q.Index('usersByEmail'), email)),
				)).catch((error) => {
					if (error instanceof errors.BadRequest) throw createAndAttachError(401, res, new Error('Invalid email and/or password'))
					throw error
				}), 'fanaudb - Merge(Login(), Get())', transaction,
			)

			const userId = monitorReturn(
				() => ref.toString().split(',')[1].replace(/[") ]/gi, ''),
				'userId', transaction,
			)

			if (twoFactorSecret) {
				const intermediateToken = getJwtToken(secret,
					{ sub: email, displayName, role, userId },
					{ type: TokenTypes.Intermediate, transaction })

				return res.status(200).json({ intermediateToken })
			} else {
				const accessToken = getJwtToken(secret, { sub: email, displayName, role, userId }, { transaction })
				const refreshToken = getJwtToken(secret, { sub: email, displayName, role, userId }, {
					type: TokenTypes.Refresh,
					transaction,
				})
				setRefreshCookie(res, refreshToken, transaction)

				return res.status(200).json({ accessToken })
			}
		}

		default: throw createAndAttachError(405, res)
	}
}
