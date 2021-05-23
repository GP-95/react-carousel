# React-Carousel

## Demo

[Demo on Netlify](https://react-carousel-scan.netlify.app)

## Setup

Import Carousel.tsx while making sure carousel.css is linked in your index file.
Use the Carousel component by passing it an array of child elements that will be displayed.

The carousel takes up 100% height and width, so a wrapper may be needed.

## Setup example

```javascript
    import Carousel from './src/Carousel'

    const arrayOfElements = [...]

    function App(){

        return (
                <div className='carousel-wrapper'>
                    <Carousel>
                        {arrayOfElements}
                    </Carousel>
                <div>
        )
    }

```

## Props overview

| Prop           |          Type          | Required | Default | Description                                                |
| :------------- | :--------------------: | :------: | :-----: | :--------------------------------------------------------- |
| children       | array of HTML elements |   yes    |  none   | Each element will represent a single slide in the carousel |
| speed          |       number/int       |    no    |   500   | Animation delay/speed                                      |
| infiniteScroll |        boolean         |    no    |  false  | Enables or disables infinite scrolling.                    |
