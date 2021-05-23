import {
	ReactChild,
	useEffect,
	useState,
	useRef,
	useReducer,
	MutableRefObject,
	ChangeEvent,
} from 'react'
import CarouselButton from './CarouselButton'
import CarouselCard from './CarouselCard'

interface Props {
	/**Elements to display in carousel */
	children: Array<JSX.Element | ReactChild | HTMLElement | Element>
	/**Speed of transition for autoRotate. Default: 300 */
	speed?: number
	/**Carousel will allow infinite scrolling, Default: true */
	infiniteScroll?: boolean
}

interface State {
	drag?: boolean
	dragStart?: number
	dragEnd?: number
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
	drag: false,
	dragStart: 0,
	dragEnd: 0,
}

function Carousel({ children, speed = 500, infiniteScroll = false }: Props) {
	const [current, setCurrent] = useState(0)
	const [scroll, setScroll] = useState(0)
	const [clickTime, setClickTime] = useState(null)
	const [userSelection, setUserSelection] = useState(1)
	const [scrolling, setScrolling] = useState(false)
	const [state, dispatch] = useReducer(reducer, initialState)

	const carouselWidth: MutableRefObject<HTMLDivElement> = useRef(null)

	function dragStart(posX: number) {
		dispatch({
			type: ActionType.SET_STATE,
			payload: {
				drag: true,
				dragStart: posX,
			},
		})
	}

	function dragEnd(posX: number) {
		if (!state.drag) {
			return
		}

		dispatch({
			type: ActionType.SET_STATE,
			payload: {
				drag: false,
				dragEnd: posX,
			},
		})
		setScroll(0) //Resets scroll after drag
	}

	function dragMove(posX: number) {
		if (
			(posX > state.dragStart && current === 0 && !infiniteScroll) ||
			(posX < state.dragStart &&
				current === children.length - 1 &&
				!infiniteScroll)
		) {
			// Stops infinite scrolling drag animation
			return
		}

		// Gets movement direction and a change percentage for scroll
		let scrollPercentage: number
		if (posX > state.dragStart) {
			scrollPercentage = Math.ceil(
				((posX - state.dragStart) * 100) /
					carouselWidth.current.clientWidth
			)
		} else {
			scrollPercentage = -Math.abs(
				Math.ceil(
					((state.dragStart - posX) * 100) /
						carouselWidth.current.clientWidth
				)
			)
		}

		// Prevents over-scrolling
		if (scrollPercentage > 100) {
			setScroll(100)
		} else if (scrollPercentage < -100) {
			setScroll(-100)
		} else {
			setScroll(scrollPercentage)
		}
	}

	// Handles button navigation
	function handleNavClick(
		direction: 'previous' | 'next',
		disableLimit = false
	) {
		const date = new Date()

		// Prevent button spamming
		if (
			Object.is(clickTime, null) ||
			date.getTime() > clickTime + 390 ||
			disableLimit
		) {
			setClickTime(Date.now())
			if (direction === 'next') {
				setCurrent((state) =>
					state === children.length - 1 && infiniteScroll
						? 0
						: state === children.length - 1
						? children.length - 1
						: state + 1
				)
				return
			}
			setCurrent((state) =>
				state === 0 && infiniteScroll
					? children.length - 1
					: state === 0
					? 0
					: state - 1
			)
		}
	}

	// Contains interval id
	const intervalId = useRef(null)

	// Contains direction of number navigation
	const direction = useRef(null)

	// Handles scrolling to specific number
	function autoScroll(current: number, target: number) {
		if (!infiniteScroll) {
			if (current < target) {
				setCurrent((state) => state + 1)
				return
			}
			setCurrent((state) => state - 1)
			return
		}

		// If infinite scrolling, then scrolls cyclically and picks shorter direction
		if (Object.is(direction.current, null)) {
			if (
				(current < target &&
					target - current < current + (children.length - target)) ||
				(current > target &&
					children.length - 1 - current + target < current - target)
			) {
				direction.current = 'next'
				return
			} else {
				direction.current = 'previous'
			}
		}
		handleNavClick(direction.current, true)
	}

	// Handles scrolling to specific number
	useEffect(() => {
		if (
			scrolling &&
			current !== userSelection - 1 &&
			userSelection - 1! < children.length
		) {
			// Delays each element change.
			intervalId.current = setInterval(
				() => autoScroll(current, userSelection - 1),
				390
			)
		} else if (scrolling) {
			// Reset state if scrolling is not needed
			setScrolling(false)
			direction.current = null
		}

		return () => clearInterval(intervalId.current)
	}, [scrolling, current])

	useEffect(() => {
		// Handle drag scrolling
		if (state.dragEnd < state.dragStart - 90 && !infiniteScroll) {
			setCurrent((state) =>
				state === children.length - 1 ? children.length - 1 : state + 1
			)
		} else if (state.dragEnd < state.dragStart - 90) {
			setCurrent((state) =>
				state === children.length - 1 ? 0 : state + 1
			)
		} else if (state.dragEnd > state.dragStart + 90 && !infiniteScroll) {
			setCurrent((state) => (state === 0 ? 0 : state - 1))
		} else if (state.dragEnd > state.dragStart + 90) {
			if (state.dragStart === 0) {
				return
			}
			setCurrent((state) =>
				state === 0 ? children.length - 1 : state - 1
			)
		}
	}, [state.dragEnd])

	return (
		<div className='carousel-main'>
			<div
				ref={carouselWidth}
				className='carousel-container'
				onTouchStart={(e) => dragStart(e.changedTouches[0].clientX)}
				onTouchEnd={(e) => dragEnd(e.changedTouches[0].clientX)}
				onTouchMove={(e) => dragMove(e.changedTouches[0].clientX)}
				onMouseDown={(e) => dragStart(e.clientX)}
				onMouseUp={(e) => dragEnd(e.clientX)}
				onMouseMove={(e) => (state.drag ? dragMove(e.clientX) : null)}
				onMouseLeave={(e) => (state.drag ? dragEnd(e.clientX) : null)}>
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
										left: `${scroll}%`,
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
			{/* <div className='button-container'>
				<CarouselButton
					hidden={current === 0 && !infiniteScroll}
					label='Prev'
					type='button'
					onClick={() => handleNavClick('previous')}
				/>
				<CarouselButton
					hidden={current === children.length - 1 && !infiniteScroll}
					label='Next'
					type='button'
					onClick={() => handleNavClick('next')}
				/>
			</div> */}
			<div className='nav-container'>
				<button
					disabled={current === 0 && !infiniteScroll ? true : false}
					className='button'
					onClick={() => handleNavClick('previous')}>
					Previous
				</button>
				<div className='num-container'>
					<button
						className='button num-button'
						onClick={() => setScrolling(true)}>
						Go to slide
					</button>
					<input
						className='num-input'
						min='1'
						max={children.length}
						type='number'
						value={userSelection}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setUserSelection(Number(e.target.value))
						}
					/>
				</div>
				<button
					disabled={
						current === children.length - 1 && !infiniteScroll
							? true
							: false
					}
					className='button'
					onClick={() => handleNavClick('next')}>
					Next
				</button>
			</div>
		</div>
	)
}

export default Carousel
