import { useState } from 'react'
import ReactDOM from 'react-dom'
import Carousel from './Carousel'

const arr = [
	{ id: 0, img: 'https://loremflickr.com/640/360' },
	{ id: 1, img: 'https://loremflickr.com/640/360' },
	{ id: 2, img: 'https://loremflickr.com/640/360' },
	{ id: 3, img: 'https://loremflickr.com/640/360' },
	{ id: 4, img: 'https://loremflickr.com/640/360' },
	{ id: 5, img: 'https://loremflickr.com/640/360' },
	{ id: 6, img: 'https://loremflickr.com/640/360' },
	{ id: 7, img: 'https://loremflickr.com/640/360' },
	{ id: 8, img: 'https://loremflickr.com/640/360' },
]

function App() {
	const [infiniteScroll, setInfiniteScroll] = useState(false)
	return (
		<div className='app-body'>
			<button
				className='infinite-button'
				onClick={() => setInfiniteScroll((state) => !state)}>
				Infinite scrolling:
				<span
					style={{
						color: infiniteScroll ? 'green' : 'maroon',
						fontWeight: 'bold',
					}}>{` ${infiniteScroll}`}</span>
			</button>
			<div className='app-container'>
				<Carousel infiniteScroll={infiniteScroll}>
					{arr.map((item, index) => {
						return (
							<div
								className='placeholder'
								style={{ backgroundImage: `url(${item.img})` }}
								key={index}
								data-bg={item.img}></div>
						)
					})}
				</Carousel>
			</div>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
