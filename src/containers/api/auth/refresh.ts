import { NextApiRequest, NextApiResponse } from 'next'

import { config } from 'config.server'

import { ApiError } from '../errors/ApiError'
import { authenticateRefreshToken, setRefreshCookie } from '../middleware'
import { generateAccessToken, generateRefreshToken } from '../generateTokens'

export const refresh = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, cookies } = req
	const refreshToken = config.environment !== 'development' ? cookies['__Host-refreshToken'] : cookies['refreshToken']

	switch (method) {
		case 'GET': {
			if (!refreshToken) {
				const error = ApiError.fromCode(400)
				res.status(error.statusCode).json({ error: error.message })
				throw error
			}

			const token = await authenticateRefreshToken(req, res)

			const accessToken = generateAccessToken(token.secret, { sub: token.sub, displayName: token.displayName })
			const newRefreshToken = generateRefreshToken(token.secret, { sub: token.sub, displayName: token.displayName })

			setRefreshCookie(res, newRefreshToken)
			res.status(200).json({ accessToken })
			break
		}

		default: {
			const error = ApiError.fromCode(405)
			res.status(error.statusCode).json({ error: error.message })
			throw error
		}
	}
}