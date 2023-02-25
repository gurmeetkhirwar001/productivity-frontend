import React, { useState } from 'react'
import reducer from './store'
import { injectReducer } from 'store/index'
import { Container } from 'components/shared'
import ScrumBoardHeader from './ScrumBoardHeader'
import Board from './Board'
import GetTasks from './projectList.js'
import Grid from './scrumBoardDrag'
import GridApp from './DataGrid'
import { useSelector } from 'react-redux'
import { setActiveTab } from 'store/tasks/project.slice'

injectReducer('scrumBoard', reducer)

const ScrumBoard = props => {
	const project = useSelector(state => state.tasks.projects)
	return (
		<>
			<ScrumBoardHeader setView={setActiveTab} view={project.activetab}/>
			<Container className="h-full">
				{/* <Board {...props}/> */}
				
			{project.activetab === 'list' ? <GetTasks /> : <Board {...props}/>}	
				{/* <Grid/> */}
			  
			</Container>
		</>
	)
}

export default ScrumBoard
