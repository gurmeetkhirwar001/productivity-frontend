import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import BoardCard from './BoardCard'
import { useSelector } from "react-redux"

function InnerList(props) {
	const { dropProvided, contents, ...rest } = props

	//constentList is id of taskname---contentList
	//data-rbd-droppable-context-id  --dropprovided
	//contents is id of taskname

	//



	const { projectlist } = useSelector((state) => state.tasks.projects)

	return (
		<div className="board-dropzone h-full" ref={dropProvided.innerRef}>
			<div className="px-4 h-full" >
				{contents?.map((item, index) => (
					<Draggable key={item.id} draggableId={String(item.id)} index={index}>
						{dragProvided => (
							<>
								<BoardCard
									data={item}
									ref={dragProvided.innerRef}
									{...dragProvided.draggableProps}
									{...dragProvided.dragHandleProps}

								/>
								{dropProvided.placeholder}</>
						)}
					</Draggable>
				))}
			</div>
		</div>
	)
}

const BoardCardList = props => {

	const {
		ignoreContainerClipping,
		internalScroll,
		scrollContainerStyle,
		isDropDisabled,
		isCombineEnabled,
		listId = 'LIST',
		style,
		listType,
		contents,
		useClone,
		cardData,
		dragHandleProps,
		draggableProps
	} = props
	// console.log(contents,"content list")
	return (
		<Droppable
			droppableId={listId}
			type={listType}
			ignoreContainerClipping={ignoreContainerClipping}
			isDropDisabled={isDropDisabled}
			isCombineEnabled={isCombineEnabled}
			renderClone={useClone}

		>
			{(dropProvided, dropSnapshot) => (
				<div style={style} className="board-wrapper overflow-hidden flex-auto"
				>
					{internalScroll ? (
						<div className="board-scrollContainer" style={scrollContainerStyle}>
							<InnerList
								contents={contents}
								listId={listId}
								cardData={cardData}
								dropProvided={dropProvided}
								dragHandleProps={dragHandleProps}
								draggableProps={draggableProps}
							/>
						</div>
					) : (
						<InnerList
							contents={contents}
							listId={listId}
							cardData={cardData}
							dropProvided={dropProvided}
							dragHandleProps={dragHandleProps}
							draggableProps={draggableProps}

						/>
					)}
					{dropProvided.placeholder}
				</div>
			)}
		</Droppable>
	)
}

export default BoardCardList
