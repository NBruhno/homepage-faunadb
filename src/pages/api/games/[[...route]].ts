import { game, games, follow, follows, unfollow, update, updateLibrary } from 'containers/api/games'
import { sendError } from 'containers/api/errors/ApiError'
import { withSentry } from 'containers/api/middleware'

export default withSentry(async (req, res, transaction) => {
	const { query: { route, following: followingQuery }, method } = req

	if (!route) { // /games
		if (followingQuery === 'true') return follows(req, res, { transaction })
		switch (method) {
			case 'GET': return games(req, res, { transaction })
			case 'PATCH':
			case 'PUT':
			case 'POST': return updateLibrary(req, res, { transaction })
			default: sendError(405, res)
		}
	}

	const [gameId, resource] = route

	switch (resource) {
		case 'follow': { // /games/{id}/follow
			return follow(req, res, { gameId, transaction })
		}
		case 'unfollow': { // /games/{id}/unfollow
			return unfollow(req, res, { gameId, transaction })
		}
		default: { // /games/{id}
			if (resource) sendError(404, res)
			else {
				transaction.setName(`${method} - api/games/{gameId}`)
				switch (method) {
					case 'GET': return game(req, res, { gameId, transaction })
					case 'PATCH': return update(req, res, { gameId, transaction })
					default: sendError(405, res)
				}
			}
		}
	}
})
