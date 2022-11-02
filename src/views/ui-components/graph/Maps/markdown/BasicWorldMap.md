```jsx
import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const BasicWorldMap = () => {
	return (
		<ComposableMap 
			height={200}
			projectionConfig={{
				scale: 100
			}}
		>
			<Geographies geography={geoUrl}>
				{({ geographies }) =>
					geographies.map(geo => <Geography fill="#EAEAEC" stroke="#D6D6DA" key={geo.rsmKey} geography={geo} />)
				}
			</Geographies>
		</ComposableMap>
	)
}

export default BasicWorldMap
```