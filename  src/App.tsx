import { Children, useState } from 'react'
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
	const [current, setCurrent] = useState(0)

	return (
		<div className='app-body'>
			<div className='app-container'>
				<Carousel
					setCurrent={setCurrent}
					current={current}
					infiniteScroll={false}>
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
			<div className='button-container'>
				<button
					className='button'
					onClick={() =>
						setCurrent((state) =>
							state === 0 ? arr.length - 1 : state - 1
						)
					}>
					Previous
				</button>
				<p style={{ fontSize: 40 }}>{current}</p>
				<button
					className='button'
					onClick={() =>
						setCurrent((state) =>
							state === arr.length - 1 ? 0 : state + 1
						)
					}>
					Next
				</button>
			</div>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
