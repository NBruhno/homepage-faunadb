import type { Interpolation } from '@emotion/serialize'

import Collapse from 'components/Collapse'

import { Container } from './Container'
import { Content } from './Content'
import { Error } from './Error'
import { Loader } from './Loader'

type Props = {
	children: React.ReactNode,
	hasError?: boolean,
	header?: React.ReactNode,
	isExpanded?: boolean,
	isLoading?: boolean,
	shouldAnimate?: boolean,
	css?: Interpolation<Theme>,
}

export const Card = ({ children, hasError = false, isExpanded = true, isLoading = false, header, shouldAnimate = true, ...rest }: Props) => (
	<Container {...rest}>
		<Collapse isOpen={isExpanded} transitionTime={shouldAnimate ? 0.2 : 0}>
			<>
				{isExpanded && hasError && <Error>Failed to load content</Error>}
				{isExpanded && !hasError && isLoading && <Loader />}
				{!hasError && !isLoading && (
					<Content header={header} isVisible={isExpanded}>
						{children}
					</Content>
				)}
			</>
		</Collapse>
	</Container>
)
