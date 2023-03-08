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
import Modal1 from '../ProjectList/modal'
import UpdateModal from '../ProjectList/updateModal'
injectReducer('scrumBoard', reducer)

const ScrumBoard = props => {
	const project = useSelector(state => state.tasks.projects)
	const [open, setOpen] = useState(false)
	return (
		<>
			<ScrumBoardHeader setView={setActiveTab} view={project.activetab} setOpen={setOpen}/>
			<Container className="h-full">
				{/* <Board {...props}/> */}
				
			{project.activetab === 'list' ? <GetTasks /> : <Board {...props}/>}	
				{/* <Grid/> */}
			  <Modal1 />

			  
			</Container>
		</>
	)
}

export default ScrumBoard
