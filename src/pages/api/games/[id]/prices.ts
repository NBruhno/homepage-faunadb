import { withSentry } from '@sentry/nextjs'

import { prices } from 'containers/api/games'
import { withSentryTracking } from 'containers/api/middleware'

const handler = withSentryTracking(async (req, res, transaction) => {
	const { query: { id }, method } = req
	const gameId = parseInt(id as string, 10)

	transaction.setName(`${method} - api/games/{gameId}/prices`)
	await prices(req, res, { gameId, transaction })
})

export default withSentry(handler)
