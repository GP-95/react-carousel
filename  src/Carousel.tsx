import {
	ReactChild,
	useEffect,
	useState,
	useRef,
	useReducer,
	MutableRefObject,
} from 'react'
import CarouselCard from './CarouselCard'

interface Props {
	/**Elements to display in carousel */
	children: Array<JSX.Element | ReactChild | HTMLElement | Element>
	/**Initial position of carousel */
	current: number
	/**Function to set value of current */
	setCurrent: Function
	/**Speed of transition for autoRotate. Default: 300 */
	speed?: number
	/**Carousel will allow infinite scrolling, Default: true */
	infiniteScroll?: boolean
}

interface State {
	touch?: boolean
	touchStart?: number
	touchEnd?: number
}

interface Action {
	type: ActionType
	payload: State
}

enum ActionType {
	SET_STATE,
}

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case ActionType.SET_STATE:
			return { ...state, ...action.payload }
		default:
			return { ...state }
	}
}

const initialState: State = {
	touch: false,
	touchStart: 0,
	touchEnd: 1,
}

function Carousel({
	children,
	current,
	setCurrent,
	speed = 500,
	infiniteScroll = false,
}: Props) {
	const [scroll, setScroll] = useState(0)
	const [state, dispatch] = useReducer(reducer, initialState)
	// Get movement direction

	const carouselWidth: MutableRefObject<HTMLDivElement> = useRef(null)

	function touchStart(e: any) {
		dispatch({
			type: ActionType.SET_STATE,
			payload: {
				touch: true,
				touchStart: e.changedTouches[0].clientX,
			},
		})
	}

	function touchEnd(e: any) {
		dispatch({
			type: ActionType.SET_STATE,
			payload: {
				touch: false,
				touchEnd: e.changedTouches[0].clientX,
			},
		})
		setScroll(0) //Resets scroll after touch
	}

	function touchMove(e: TouchEvent) {
		const movement = e.touches[0].clientX

		if (
			(movement > state.touchStart && current === 0) ||
			(movement < state.touchStart &&
				current === children.length - 1 &&
				!infiniteScroll)
		) {
			// Stops infinite scrolling touch animation
			return
		}

		let scrollPercentage
		if (movement > state.touchStart) {
			scrollPercentage = Math.ceil(
				((movement - state.touchStart) * 100) /
					carouselWidth.current.clientWidth
			)
		} else {
			scrollPercentage = -Math.abs(
				Math.ceil(
					((state.touchStart - movement) * 100) /
						carouselWidth.current.clientWidth
				)
			)
		}
		setScroll(scrollPercentage * 3)
	}

	useEffect(() => {
		// Handle touch scrolling
		if (state.touchEnd < state.touchStart && !infiniteScroll) {
			setCurrent((state) =>
				state === children.length - 1 ? children.length - 1 : state + 1
			)
		} else if (state.touchEnd < state.touchStart) {
			setCurrent((state) =>
				state === children.length - 1 ? 0 : state + 1
			)
		} else if (state.touchEnd > state.touchStart && !infiniteScroll) {
			setCurrent((state) => (state === 0 ? 0 : state - 1))
		} else if (state.touchEnd > state.touchStart) {
			if (state.touchStart === 0) {
				return
			}
			setCurrent((state) =>
				state === 0 ? children.length - 1 : state - 1
			)
		}
	}, [state.touchEnd])

	return (
		<div
			ref={carouselWidth}
			className='carousel-container'
			onTouchStart={(e) => touchStart(e)}
			onTouchEnd={(e) => touchEnd(e)}
			onTouchMove={(e) => touchMove(e)}>
			{children.map((item, index) => {
				switch (true) {
					case current === index:
						// Active card
						return (
							<CarouselCard
								child={item}
								style={{
									opacity: 1,
									transition: `${speed}ms ease all`,
									left: scroll,
								}}
								key={index}
							/>
						)
					case current === children.length - 1 && index === 0:
						// Next card, if last elem. is active.
						return (
							<CarouselCard
								child={item}
								style={{
									left: `${scroll + 100}%`,
									transition: `${speed}ms ease all`,
								}}
								key={index}
							/>
						)
					case current === 0 && index === children.length - 1:
						// Previous card, if first elem is active.
						return (
							<CarouselCard
								child={item}
								style={{
									left: `${scroll - 100}%`,
									transition: `${speed}ms ease all`,
								}}
								key={index}
							/>
						)
					case index === current + 1 || index === current - 1:
						// Previous or next card if any other is active.
						return (
							<CarouselCard
								child={item}
								key={index}
								style={{
									left:
										index === current - 1
											? `${scroll - 100}%`
											: `${scroll + 100}%`,
									transition: `${speed}ms ease all`,
								}}
							/>
						)
				}
			})}
		</div>
	)
}

export default Carousel
