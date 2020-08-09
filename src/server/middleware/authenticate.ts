import { NextApiRequest, NextApiResponse } from 'next'
import { JWT, errors } from 'jose'

import { config } from 'config.server'

import { ApiError } from 'server/errors/ApiError'
import { Token, TokenTypes } from 'types/Token'
import { decrypt } from 'server/cipher'

export type Options = {
	/** Does not error out if authentication fails, but still decodes the token if valid */
	optional?: boolean,
	/** A token is automatically supplied through the request, but can be supplied manually */
	token?: string,
}

const resolveError = (error: any, res: NextApiResponse) => {
	if (error instanceof errors.JOSEError) {
		const apiError = ApiError.fromCode(401)
		res.status(apiError.statusCode).json({ error: apiError.message })
	} else {
		const apiError = ApiError.fromCode(500)
		res.status(apiError.statusCode).json({ error: apiError.message })
		throw error
	}
	throw error
}

export const authenticateAccessToken = async (req: NextApiRequest, res: NextApiResponse, { optional = false, token }: Options = {}) => {
	const { headers: { authorization } } = req

	if (!authorization && !optional) {
		const error = ApiError.fromCode(401)
		res.status(error.statusCode).json({ error: error.message })
		throw error
	}

	try {
		let decodedToken = null as Token

		try {
			decodedToken = <Token>JWT.verify(token || authorization?.split('Bearer ')[1], config.auth.publicKey, {
				algorithms: ['RS256'],
				audience: ['https://bruhno.com', 'https://bruhno.dev'],
				issuer: 'https://bruhno.dev',
			})
		} catch (error) {
			if (!optional) {
				throw error
			}
		}

		if (decodedToken?.type !== TokenTypes.Access && !optional) {
			const error = ApiError.fromCode(401)
			res.status(error.statusCode).json({ error: error.message })
			throw error
		}

		if (decodedToken) decodedToken = { ...decodedToken, secret: decrypt(decodedToken.secret) }

		return decodedToken
	} catch (error) {
		resolveError(error, res)
	}
}

export const authenticateRefreshToken = async (req: NextApiRequest, res: NextApiResponse, token?: string) => {
	const { cookies } = req
	const refreshToken = config.environment !== 'development' ? cookies['__Host-refreshToken'] : cookies['refreshToken']

	if (!refreshToken) {
		const error = ApiError.fromCode(401)
		res.status(error.statusCode).json({ error: error.message })
		throw error
	}

	try {
		let decodedToken = <Token>JWT.verify(token || refreshToken, config.auth.refresh.publicKey, {
			algorithms: ['RS256'],
			audience: ['https://bruhno.com', 'https://bruhno.dev'],
			issuer: 'https://bruhno.dev',
		})

		if (decodedToken.type !== TokenTypes.Refresh) {
			const error = ApiError.fromCode(401)
			res.status(error.statusCode).json({ error: error.message })
			throw error
		}

		decodedToken = { ...decodedToken, secret: decrypt(decodedToken.secret) }

		return decodedToken
	} catch (error) {
		resolveError(error, res)
	}
}

export const authenticateIntermediateToken = async (req: NextApiRequest, res: NextApiResponse, token?: string) => {
	const { headers: { authorization } } = req

	if (!authorization) {
		const error = ApiError.fromCode(401)
		res.status(error.statusCode).json({ error: error.message })
		throw error
	}

	try {
		let decodedToken = <Token>JWT.verify(token || authorization?.split('Bearer ')[1], config.auth.publicKey, {
			algorithms: ['RS256'],
			audience: ['https://bruhno.com', 'https://bruhno.dev'],
			issuer: 'https://bruhno.dev',
		})

		if (decodedToken.type !== TokenTypes.Intermediate) {
			const error = ApiError.fromCode(401)
			res.status(error.statusCode).json({ error: error.message })
			throw error
		}

		decodedToken = { ...decodedToken, secret: decrypt(decodedToken.secret) }

		return decodedToken
	} catch (error) {
		resolveError(error, res)
	}
}
