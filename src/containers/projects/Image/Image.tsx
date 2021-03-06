import NextImage from 'next/image'

type Props = {
	height: string | number,
	loading?: 'lazy' | 'eager',
	quality?: number,
	src: string,
	title: string,
	width: string | number,
}

export const Image = ({ loading = 'lazy', title, width, height, src, quality, ...rest }: Props) => (
	<div
		css={{
			cursor: 'zoom-in',
			display: 'flex',
			justifyContent: 'center',
		}}
	>
		<NextImage
			alt={title}
			height={height}
			loading={loading}
			quality={quality}
			src={src}
			width={width}
			{...rest}
		/>
	</div>
)
