# React-Carousel

## Demo

[Demo on Netlify](https://react-carousel-scan.netlify.app)

In this demo, infinite scrolling is enabled for buttons but not for touch controls.

## Setup

Import the Carousel.tsx component into your project and pass it an array of elements as **children**. The Carousel always takes up 100% with and 100% height, so a container/wrapper may be necessary.

Make sure the carousel.css file is linked in your html file.

Create a number state with the useState hook and pass the state to the Carousel component as props with the name of **current**. Pass the state update function to the Carousel as props with the name of **setCurrent**.

Touch navigation is handled by the Carousel component internally, but buttons and programmatic navigation is handled by the user by changing the value of the state that is passed to **current**.

**Note: The value of state should never be less than 0 or higher than the length - 1 of the array that is passed to the Carousel as children.**

## Example

Basic setup:

```javascript
    import Carousel from './src/Carousel'
    import {useState} from 'react'

    const arrayOfElements = [...]

    function App(){
        const [state, setState] = useState(0)

        return (
                <div className='carousel-wrapper'>
                    <Carouel current={state} setCurrent={setState}>
                        {arrayOfElements}
                    </Carousel>
                <div>
        )
    }

```

To handle non-touch navigation increment the state passed to Carousel as props _current_.

```javascript

    const arrayOfElements = [...]

    function App(){
        const [state, setState] = useState(0)

        return (
            <div>
                <div className='carousel-wrapper'>
                    <Carouel current={state} setCurrent={setState}>
                        {arrayOfElements}
                    </Carousel>
                <div>

                // This button allows for infinite scrolling by looping the carousel.
                <button onClick={
                    ()=> setState((state) =>
                    state === 0 ? arrOfElements.length - 1 : state - 1)}>
                    Previous</button>

                // This button does not allow for infinite scrolling
                <button onClick={
                    ()=>setState((state) =>
				    state === arrOfElements.length - 1 ? state : state + 1)}>
                    Next</button>
            </div>
        )
    }
```

## Props overview

| Prop           |          Type          | Required | Default | Description                                                   |
| :------------- | :--------------------: | :------: | :-----: | :------------------------------------------------------------ |
| children       | array of HTML elements |   yes    |  none   | Each element will represent a single slide in the carousel    |
| current        |   state - number/int   |   yes    |  none   | The initial slide that that will be displayed in the carousel |
| setCurrent     |  set state - Function  |   yes    |  none   | A function that allows the **current** state be set           |
| speed          |       number/int       |    no    |   500   | Animation delay/speed                                         |
| infiniteScroll |        boolean         |    no    |  false  | Enables or disables infinite scrolling for touch controls.    |
