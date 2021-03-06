import type { Website } from 'types/Games'
import { WebsiteCategory } from 'types/IGDB'

import {
	SteamIcon, GooglePlayIcon, GoGIcon, RedditIcon, AppleIcon, TwitterIcon, YouTubeIcon,
	EpicGamesIcon, ItchIoIcon, DiscordIcon, TwitchIcon, WorldIcon,
} from 'components/Icons'

export enum SortBy {
	Stores = 'stores',
}

type Props = {
	websites: Array<Website> | null,
	sortBy?: SortBy,
} & React.ComponentProps<'div'>

export const WebsiteIcons = ({ websites, sortBy, ...rest }: Props) => {
	const websiteInformation = {
		[WebsiteCategory.Android]: { logo: <GooglePlayIcon size={32} />, name: 'Google Play store' },
		[WebsiteCategory.Discord]: { logo: <DiscordIcon size={32} />, name: 'Discord' },
		[WebsiteCategory.EpicGames]: { logo: <EpicGamesIcon size={32} />, name: 'Epic Games store' },
		[WebsiteCategory.Facebook]: { logo: null, name: 'Deprecated' },
		[WebsiteCategory.GoG]: { logo: <GoGIcon size={32} />, name: 'Good old Games store' },
		[WebsiteCategory.Instagram]: { logo: null, name: 'Deprecated' },
		[WebsiteCategory.iPad]: { logo: <AppleIcon size={32} />, name: 'iPad site' },
		[WebsiteCategory.iPhone]: { logo: <AppleIcon size={32} />, name: 'iPhone site' },
		[WebsiteCategory.Itch]: { logo: <ItchIoIcon size={32} />, name: 'Itch.io website' },
		[WebsiteCategory.Official]: { logo: <WorldIcon size={32} />, name: 'Official website' },
		[WebsiteCategory.Reddit]: { logo: <RedditIcon size={32} />, name: 'Sub-reddit' },
		[WebsiteCategory.Steam]: { logo: <SteamIcon size={32} />, name: 'Steam store' },
		[WebsiteCategory.Twitch]: { logo: <TwitchIcon size={32} />, name: 'Twitch profile' },
		[WebsiteCategory.Twitter]: { logo: <TwitterIcon size={32} />, name: 'Twitter profile' },
		[WebsiteCategory.Wiki]: { logo: null, name: 'Deprecated' },
		[WebsiteCategory.Wikipedia]: { logo: null, name: 'Deprecated' },
		[WebsiteCategory.YouTube]: { logo: <YouTubeIcon size={32} />, name: 'YouTube channel' },
	}

	if (!websites || websites.length <= 0) return null

	const sortedList = () => {
		switch (sortBy) {
			case SortBy.Stores: return websites.filter(({ category }) => (
				category === WebsiteCategory.Official
				|| category === WebsiteCategory.Android
				|| category === WebsiteCategory.iPad
				|| category === WebsiteCategory.iPhone
				|| category === WebsiteCategory.Itch
				|| category === WebsiteCategory.GoG
				|| category === WebsiteCategory.EpicGames
				|| category === WebsiteCategory.Steam
			))
			default: return websites
		}
	}

	return (
		<div
			css={(theme: Theme) => ({
				gridGap: '6px',
				display: 'grid',
				gridTemplateColumns: `repeat(${sortedList().length}, 34px)`,
				maxWidth: '100%',

				[theme.mediaQueries.maxMobile]: {
					margin: '12px 0 32px',
					justifyContent: 'center',
				},
			})}
			{...rest}
		>
			{sortedList().map(({ url, category }, index) => (
				<a
					href={url}
					target='_blank'
					rel='noreferrer noopener'
					key={index}
					css={(theme: Theme) => ({
						color: theme.color.gray070,
						maxHeight: '32px',
						maxWidth: '36px',
						padding: '2px',

						'&:hover': {
							color: theme.color.gray100,
						},
					})}
					aria-label={websiteInformation[category].name}
				>
					{websiteInformation[category].logo}
				</a>
			))}
		</div>
	)
}
