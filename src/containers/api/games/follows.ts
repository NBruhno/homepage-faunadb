import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

import { config } from 'config.server'

import type { SimpleGame } from 'types/Games'
import type { Options } from '../types'

import { absoluteUrl } from 'lib/absoluteUrl'
import { fetcher, Method } from 'lib/fetcher'

import { shouldUpdate } from './lib'

import { faunaClient } from '../faunaClient'
import { authenticate } from '../middleware'
import { monitorReturnAsync } from '../performanceCheck'

export const follows = async (req: NextApiRequest, res: NextApiResponse, options: Options) => {
	const { transaction } = options
	const token = authenticate(req, res, { transaction })

	const games = await monitorReturnAsync(() => faunaClient(token.secret).query<{ data: Array<SimpleGame> }>(
		q.Map(
			q.Paginate(
				q.Join(
					q.Match(q.Index('gamesUserDataByOwnerSortByIdAsc'), q.Identity()),
					q.Index('gamesByIdSortByReleaseDateAsc'),
				),
			),
			q.Lambda(
				['releaseDate', 'hype', 'name', 'id', 'cover', 'status', 'lastChecked', 'updatedAt', 'ref'],
				{
					id: q.Var('id'),
					name: q.Var('name'),
					cover: q.Var('cover'),
					releaseDate: q.Var('releaseDate'),
					hype: q.Var('hype'),
					status: q.Var('status'),
					lastChecked: q.Var('lastChecked'),
					updatedAt: q.Var('updatedAt'),
					ref: q.Var('ref'),
				},
			),
		),
	).then(({ data }) => data), 'faunadb - Map(Paginate(), Lambda())', transaction)

	const gamesToUpdate = games.filter((game) => shouldUpdate(game))
	if (gamesToUpdate.length > 0) {
		fetcher(`/games`, {
			absoluteUrl: absoluteUrl(req).origin,
			accessToken: config.auth.systemToken,
			body: { gamesToUpdate: gamesToUpdate.map(({ id }) => id) },
			method: Method.Patch,
		})
	}

	return res.status(200).json({ following: games })
}
