```jsx
import React from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule
} from 'react-simple-maps'

const geoUrl ='https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const GraticuleMap = () => {
	return (
		<ComposableMap projectionConfig={{ scale: 80 }} height={200}>
			<Graticule stroke="#F53" />
			<Geographies geography={geoUrl}>
				{({ geographies }) =>
					geographies.map(geo => <Geography key={geo.rsmKey} fill="#9998A3" stroke="#EAEAEC" geography={geo} />)
				}
			</Geographies>
		</ComposableMap>
	)
}

export default GraticuleMap
```