import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import BoardTitle from './BoardTitle'
import BoardCardList from './BoardCardList'

const BoardColumn = props => {

	const { title, contents, index, isScrollable, isCombineEnabled, useClone } = props
	console.log(contents,"contents")
	return (
		<Draggable draggableId={title}  index={index}>
			{
				(provided, snapshot) => (
					<div 
						className="
							board-column 
							flex 
							flex-col
							mb-3
							min-w-[300px] 
							w-[300px] 
							max-w-[300px] 
							p-0
							rounded-lg
						" 
						ref={provided.innerRef} 
						
					>
						<BoardTitle
							title={title}
							
						/>
						{/* <DropZone ref={dropProvided.innerRef}> */}
						<BoardCardList
							listId={title}
							listType="CONTENT"
							className={snapshot.isDragging ? 'is-dragging' : ''}
							contents={contents[0][title]}
							internalScroll={isScrollable}
							isCombineEnabled={Boolean(isCombineEnabled)}
							useClone={useClone}
							dragHandleProps={provided.dragHandleProps} 
							draggableProps={provided.draggableProps}
						/>
						{/* {provided.placeholder}
						</DropZone> */}
					</div>
				)
			}
		</Draggable>
	)
}

export default BoardColumn
