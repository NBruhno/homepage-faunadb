import { NextApiRequest, NextApiResponse } from 'next'
import { query as q, errors } from 'faunadb'

import type { Options as DefaultOptions } from '../types'

import { sendError } from '../errors/ApiError'
import { authenticate } from '../middleware'
import { faunaClient } from '../faunaClient'
import { monitorAsync, monitorReturnAsync } from '../performanceCheck'

type Options = {
	gameId: string,
} & DefaultOptions

export const follow = async (req: NextApiRequest, res: NextApiResponse, options: Options) => {
	const { method } = req
	const { gameId, transaction } = options
	transaction.setName(`${method} - api/games/{gameId}/follow`)

	const { secret } = authenticate(req, res, { transaction })

	switch (method) {
		case 'GET': {
			const userData = await monitorReturnAsync(() => faunaClient(secret).query<{ data: { following: boolean } }>(
				q.Get(q.Match(q.Index('gamesUserDataByIdAndOwner'), [gameId, q.Identity()])),
			).catch((error) => {
				if (error instanceof errors.NotFound) {
					return {
						data: {
							following: false,
						},
					}
				} else throw error
			}).then((response) => response.data), 'faunadb - Get()', transaction)
			return res.status(200).json({ ...userData })
		}
		case 'POST': {
			await monitorAsync(() => faunaClient(secret).query(
				q.Create(q.Collection('gamesUserData'), {
					data: {
						id: gameId,
						owner: q.Identity(),
						following: true,
					},
				}),
			), 'faunadb - Create()', transaction).catch(async (error) => {
				if (error.description.includes('unique') && error instanceof errors.BadRequest) {
					await monitorAsync(() => faunaClient(secret).query(
						q.Update(q.Select(['ref'], q.Get(q.Match(q.Index('gamesUserDataByIdAndOwner'), [gameId, q.Identity()]))), {
							data: {
								following: true,
							},
						}),
					), 'faunadb - Update()', transaction)
				} else throw error
			})

			return res.status(200).json({ message: 'Successfully followed the game' })
		}

		default: sendError(405, res)
	}
}
