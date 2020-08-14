import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

import { ApiError } from '../errors/ApiError'
import { serverClient } from '../faunaClient'

export const check = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, body: { email } } = req

	switch (method) {
		case 'POST': {
			if (!email) {
				const error = ApiError.fromCode(400)
				res.status(error.statusCode).json({ error: error.message })
				throw error
			}

			let userExists = false

			try {
				const user = await serverClient.query(
					q.Get(q.Match(q.Index('users_by_email'), email)),
				)

				if (user) {
					userExists = true
				}
			} catch (error) {
				if (error.requestResult.statusCode !== 404) {
					const apiError = ApiError.fromCode(error.statusCode)
					res.status(apiError.statusCode).json({ error: apiError.message })
					throw apiError
				}
			}

			res.status(200).json({ userExists })
			break
		}

		default: {
			const error = ApiError.fromCode(405)
			res.status(error.statusCode).json({ error: error.message })
			throw error
		}
	}
}