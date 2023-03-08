import React from 'react'
import { Button } from 'components/ui'
import { useDispatch } from 'react-redux'
import { openDialog, updateDialogView } from './store/stateSlice'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import { setCreateModal } from 'store/tasks/project.slice'

const BoardAddNewColumn = ({}) => {

	const dispatch = useDispatch()

	const onAddNewColumn = () => {
		dispatch(updateDialogView('NEW_COLUMN'))
		dispatch(openDialog())
	}

	return (
		<Button size="sm" icon={<HiOutlinePlusCircle />} onClick={() => dispatch(setCreateModal(true))}>
			<span>New Board</span>
		</Button>
	)
}

export default BoardAddNewColumn
