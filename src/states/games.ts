import type { Game, SimpleGame, Price } from 'types/Games'

import { useState, useEffect, useMemo } from 'react'
import useSWR from 'swr'

import { useAuth } from 'states/auth'

import { fetcher, Method } from 'lib/fetcher'

import { useGlobalState } from './globalState'

export const useGame = (id: string) => {
	const { user } = useAuth()
	const [following, setFollowing] = useState<boolean | undefined>(undefined)
	const { data: game, error } = useSWR<Game>(id ? `/games/${id}` : null, (link) => fetcher(link), { revalidateOnFocus: false })
	const { data: followingData } = useSWR<{ following: boolean }>((id && user?.accessToken)
		? `/games/${id}/follows`
		: null, (link) => fetcher(link, { accessToken: user?.accessToken }), { revalidateOnFocus: false })

	const follow = async () => {
		const response = await fetcher<{ message?: string }>(`/games/${id}/follows`, { accessToken: user.accessToken, method: Method.Post })

		if (response.message) setFollowing(true)
	}

	const canGetPrices = useMemo(() => id && game?.name && !error, [id, game?.name, error])
	const { data: prices } = useSWR<{ prices: Array<Price> }>(canGetPrices
		? `/games/${id}/prices?name=${game?.name}`
		: null, (link) => fetcher(link), { revalidateOnFocus: false })

	const unfollow = async () => {
		const response = await fetcher<{ message?: string }>(`/games/${id}/follows`, { accessToken: user.accessToken, method: Method.Patch })
		if (response.message) setFollowing(false)
	}
	useEffect(() => setFollowing(followingData?.following), [followingData?.following])

	return { game, following, ...prices, follow: async () => follow(), unfollow: async () => unfollow() }
}

export const useSearchGames = () => {
	const [{ games: gamesSearch }] = useGlobalState('forms')
	const [gamesState, setGameState] = useGlobalState('games')
	const { data } = useSWR<{ games: Array<SimpleGame> }>(gamesSearch?.search
		? ['/games?search=', gamesSearch?.search]
		: null, (link, searchParameter) => fetcher(`${link}${searchParameter}`), { revalidateOnFocus: false })

	const setHasSearch = (hasSearch: boolean) => {
		if (hasSearch !== gamesState.hasSearch) {
			setGameState({ ...gamesState, hasSearch })
		}
	}

	return { games: data?.games, gamesSearch, hasSearch: gamesState.hasSearch, setHasSearch }
}

export const usePopularGames = () => {
	const { data } = useSWR<{ games: Array<SimpleGame> }>(['/games'], (link) => fetcher(link), { revalidateOnFocus: false })
	return { games: data?.games }
}

export const useFollowingGames = ({ followedGamesUser }: { followedGamesUser?: string | Array<string> } = {}) => {
	const { user } = useAuth()
	const { data } = useSWR<{ games: Array<SimpleGame> }>((user?.isStateKnown && (followedGamesUser || user.userId))
		? ['/games?user=', followedGamesUser]
		: null, (link, followedGamesUser) => fetcher(`${link}${followedGamesUser ?? user.userId}`), { revalidateOnFocus: false })

	return { games: data?.games }
}
