interface Props {
	label: string
	type?: 'button' | 'submit' | 'reset'
	/**Overwrite default style. */
	style?: object
	onClick: Function
	hidden?: boolean
}

function CarouselButton({
	label,
	type = 'button',
	style = {},
	onClick,
	hidden = false,
}: Props) {
	return (
		<button
			type={type}
			style={{
				opacity: hidden ? 0 : 1,
				pointerEvents: hidden ? 'none' : 'all',
				...style,
			}}
			className='carousel-button'
			onClick={() => onClick()}>
			<p className='button-content'>{label}</p>
		</button>
	)
}

export default CarouselButton
