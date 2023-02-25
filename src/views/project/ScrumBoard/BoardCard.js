import { forwardRef } from 'react'
import classNames from 'classnames'
import { Card, Tag } from 'components/ui'
import UsersAvatarGroup from 'components/shared/UsersAvatarGroup'
import IconText from 'components/shared/IconText'
import { HiOutlineChatAlt2, HiOutlinePaperClip, HiFlag } from 'react-icons/hi'
import { openDialog, updateDialogView, setSelectedTicketId } from './store/stateSlice'
import { useDispatch, useSelector } from 'react-redux'
import { taskLabelColors } from './utils'
import dayjs from 'dayjs'


const BoardCard = forwardRef((props, ref) => {

	const dispatch = useDispatch()

	const selectedTab = useSelector(state => state.scrumBoard.state.selectedTab)

	const { listId, cardData, data, ...rest } = props

	const { id, name, comments, attachments, members, dueDate, labels } = data
	const authors = [
		{
		  id: 1,
		  text: "Low",
		},
		{
		  id: 2,
		  text: "Normal",
		},
		{
		  id: 3,
		  text: "High",
		},
		{
		  id: 4,
		  text: "Urgent",
		},
	  ];
	const onCardClick = () => {
		dispatch(openDialog())
		dispatch(updateDialogView('TICKET'))
		dispatch(setSelectedTicketId(id))
	}
	const labelss = authors.find((aut) => aut.id == data?.tasksstatus)
	return (
		<Card 
			ref={ref}
			className={
				classNames(
					'hover:shadow-lg rounded-lg dark:bg-gray-700 bg-gray-50',
					(selectedTab !== 'All' && !labels.includes(selectedTab)) ? 'opacity-0 overflow-hidden h-0' : 'mb-4'
				)
			}
			bodyClass="p-4"
			clickable
			onClick={() => onCardClick()}
			{...rest}
			
		>
			{
				
						<Tag
							// key={label + index}
							className="mr-2 rtl:ml-2 mb-2" 
							prefix 
							prefixClass={`${taskLabelColors[labelss.text]}`}
						>
							{labelss.text}
						</Tag>
				}
			<h6 className="mb-2">{data?.tasksname}</h6>
			{
				dueDate 
				&& 
				<IconText 
					textClass="text-sm font-semibold" 
					className="mb-2" 
					icon={<HiFlag className="text-lg" />}
				>
					{dayjs(dueDate).format('MMMM DD')}
				</IconText>
			}
			<div className="flex items-center justify-between mt-3">
				<UsersAvatarGroup avatarProps={{size: 25}} users={members} />
				<div className="flex items-center gap-2">
					{
						comments?.length > 0 
						&& 
						<IconText
							className="font-semibold" 
							icon={<HiOutlineChatAlt2 className="text-base" />}
						>
							{comments.length}
						</IconText>}
					{
						attachments?.length > 0 
						&& 
						<IconText
							icon={<HiOutlinePaperClip/>}
							className="text-base" 
						>
							{attachments.length}
						</IconText>
					}
				</div>
			</div>
		</Card>
	)
})

export default BoardCard
