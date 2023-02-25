import React from 'react'
import { Tabs } from 'components/ui'
import { labelList } from './utils'
import { setSelectedTab } from './store/stateSlice'
import { useSelector, useDispatch } from 'react-redux'
// import {} from "../"
const { TabNav, TabList } = Tabs

const QuickFilterTab = ({view, setView}) => {

	const dispatch = useDispatch()

	const selectedTab = useSelector(state => state.scrumBoard.state.selectedTab)

	const handleTabChange = val => {
		dispatch(setSelectedTab(val))
	}
	
	return (
		<>
		<Tabs value={view} variant="pill" onChange={(value) => dispatch(setView(value))}>
		<TabList>
				<TabNav value="list">List</TabNav>
				<TabNav value="board">Board</TabNav>
			</TabList>
			</Tabs>
			<Tabs value={selectedTab} variant="pill" onChange={handleTabChange}>
			
			<TabList>
				<TabNav value="All">All</TabNav>
				{labelList.map((tab, index) => (
					<TabNav key={`${tab}-${index}`} value={tab}>{tab}</TabNav>
				))}
			</TabList>
		</Tabs>
		</>
		
	)
}

export default QuickFilterTab