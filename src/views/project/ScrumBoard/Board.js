import React, { useEffect, lazy, Suspense, useState } from 'react'
import { Dialog } from 'components/ui'
import { Droppable, DragDropContext } from 'react-beautiful-dnd'
import { getBoards } from './store/dataSlice'
import { useSelector, useDispatch } from 'react-redux'
import { updateColumns, updateOrdered } from './store/dataSlice'
import { closeDialog } from './store/stateSlice'
import { reorder, reorderQuoteMap } from './utils'
import BoardColumn from './BoardColumn'
import { getProjects,getTask,UpdateTaskStatus } from '../ProjectList/components/projectList/getData';
import { setprojectList, settasklist } from 'store/tasks/project.slice'
import styled from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import { socket } from "utils/socketIO";
const TicketContent = lazy(() => import('./TicketContent'))
const AddNewTicketContent = lazy(() => import('./AddNewTicketContent'))
const AddNewColumnContent = lazy(() => import('./AddNewColumnContent'))
const AddNewMemberContent = lazy(() => import('./AddNewMemberContent'))
const Container = styled.div`
  background-color: ${colors.B100};
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const Board = props => {
	const { containerHeight, useClone, isCombineEnabled, withScrollableColumns } = props
	const project = useSelector(state => state.tasks.projects)
	const dispatch = useDispatch()
	const {user} = useSelector(state => state.auth)
	const columns = useSelector(state => state.scrumBoard.data.columns)
	const ordered = useSelector(state => state.scrumBoard.data.ordered)
	const dialogOpen = useSelector(state => state.scrumBoard.state.dialogOpen)
	const dialogView = useSelector(state => state.scrumBoard.state.dialogView)
	const [order, setOrder] = useState([{
		id: "1",
		name: "To Do",
		// url: "http://adventuretime.wikia.com/wiki/Jake",
		// avatarUrl: jakeImg,
		// colors: {
		//   soft: colors.Y50,
		//   hard: colors.N400A
		// }
	  },{
		id: "2",
		name: "IN Progress",
		// url: "http://adventuretime.wikia.com/wiki/BMO",
		// avatarUrl: bmoImg,
		// colors: {
		//   soft: colors.G50,
		//   hard: colors.N400A
		// }
	  },{
		id: "3",
		name: "Qa",
		// url: "http://adventuretime.wikia.com/wiki/Finn",
		// avatarUrl: finnImg,
		// colors: {
		//   soft: colors.B50,
		//   hard: colors.N400A
		// }
	  },{
		id: "4",
		name: "Completed",
		// url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
		// avatarUrl: princessImg,
		// colors: {
		//   soft: colors.P50,
		//   hard: colors.N400A
		// }
	  }])
	  console.log(order,"hiiii")
	const onDialogClose = () => {
		dispatch(closeDialog())
	}
	useEffect(() => {
		// dispatch(getBoards())
		// updateTasks(dispatch(settasklist))
	}, [dispatch],data=>{
		console.log(data,"hellomaam")
	})
	const dataForCol = order.map((or) => {
		const arr = project?.projectlist.filter((pr) => pr.priority_Desc == or.name || or.id == Number(pr?.priority_Desc));
		return {
			[or.name]: arr
		}
	})
	console.log(dataForCol,"dataForCol")
	const onDragEnd = result => {
		console.log(result,"result")
		// if (result.combine) {
		// 	if (result.type === 'COLUMN') {
		// 		const shallow = [...order]
		// 		shallow.splice(result.source.index, 1)
		// 		dispatch(updateOrdered(shallow))
		// 		return
		// 	}

		// 	const column = columns[result.source.droppableId]
		// 	const withQuoteRemoved = [...column]
		// 	withQuoteRemoved.splice(result.source.index, 1)
		// 	const newColumns = {
		// 		...columns,
		// 		[result.source.droppableId]: withQuoteRemoved,
		// 	}
		// 	dispatch(updateColumns(newColumns))
		// 	return
		// }

		if (!result.destination) {
			return
		}

		const source = result.source
		const destination = result.destination
	
		if (source.droppableId === destination.droppableId && source.index === destination.index) {
			return
		}
	
		if (result.type === 'CONTENT') {
			console.log(result.destination.droppableId)
			const dest = order.find(or => or.name == result.destination.droppableId)
			console.log(dest.name,"destname")
			UpdateTaskStatus(user, dest.name)
			// socket.emit("getTask", true);
  			// socket.on("receive-projects", (data) => dispatch(setprojectList(data)));
			return
		}
		
		// const data = reorderQuoteMap({
		// 	quoteMap: columns,
		// 	source,
		// 	destination,
		// })

		// dispatch(updateColumns(data.quoteMap))
	}

	return (
		<>
			 <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping={Boolean(containerHeight)}
          isCombineEnabled={isCombineEnabled}
        >
          {(provided) => (
            <Container ref={provided.innerRef} {...provided.droppableProps}>
              {order.map((key, index) => (
                <BoardColumn
                  key={key.id}
                  index={index}
                  title={key.name}
                  contents={dataForCol.filter((da) => Object.keys(da).toString() == key.name)}
                  isScrollable={withScrollableColumns}
                  isCombineEnabled={isCombineEnabled}
                  useClone={useClone}
                />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
		</>
	)
}

export default Board
