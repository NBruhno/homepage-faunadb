import { CoverWrapper } from './CoverWrapper'
import { Image } from './Image'
import { Placeholder } from './Placeholder'

const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII='

type Props = {
	coverUrl?: string | null,
	size?: string,
} & React.ComponentProps<'img'>

export const Cover = ({ size = 'big', coverUrl, ...rest }: Props) => {
	if (!coverUrl) {
		return (
			<CoverWrapper size={size} {...rest}>
				<Placeholder />
			</CoverWrapper>
		)
	}

	return (
		<CoverWrapper size={size} {...rest}>
			<Image src={coverUrl ?? placeholderImage} />
		</CoverWrapper>
	)
}
