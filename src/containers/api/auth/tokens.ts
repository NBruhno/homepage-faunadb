import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'

import { ApiError } from '../errors/ApiError'
import { authenticate } from '../middleware'
import { faunaClient } from '../faunaClient'

export const tokens = async (req?: NextApiRequest, res?: NextApiResponse) => {
	const { method } = req
	const token = authenticate(req, res)

	switch (method) {
		case 'GET': {
			const getProfile = async () => {
				const ref: { id: string } = await faunaClient(token.secret).query(q.Paginate(q.Match(
					q.Index('tokens_by_instance'),
					q.Select('instance', q.Identity()),
				)))
				return ref
			}

			res.status(200).json({ tokens: await getProfile() })
			break
		}

		default: {
			const error = ApiError.fromCode(404)
			res.status(error.statusCode).json({ error: error.message })
			throw error
		}
	}
}