```jsx
import React from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule
} from 'react-simple-maps'

const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'


const EuropeMapWithGraticule = () => {
	return (
		<ComposableMap
			projection="geoAzimuthalEqualArea"
			height={200}
			projectionConfig={{
				rotate: [-20.0, -52.0, 0],
				scale: 300
			}}
		>
			<Graticule stroke="#EAEAEC" />
			<Geographies geography={geoUrl}>
				{({ geographies }) =>
					geographies.map(geo => (
						<Geography
							key={geo.rsmKey}
							geography={geo}
							fill="#9998A3"
							stroke="#EAEAEC"
						/>
					))
				}
			</Geographies>
		</ComposableMap>
	)
}

export default EuropeMapWithGraticule
```