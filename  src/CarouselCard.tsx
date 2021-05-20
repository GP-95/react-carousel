import { ReactChild } from 'react'

interface Props {
	child?: JSX.Element | Element | HTMLElement | ReactChild
	style?: object
}

function CarouselCard({ child, style }: Props) {
	return (
		<div
			className={`carousel-card`}
			style={{
				...style,
			}}>
			{child}
		</div>
	)
}

export default CarouselCard
