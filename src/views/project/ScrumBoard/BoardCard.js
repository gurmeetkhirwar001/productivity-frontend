import { forwardRef, useState } from 'react'
import classNames from 'classnames'
import { Button, Card, Tag } from 'components/ui'
import UsersAvatarGroup from 'components/shared/UsersAvatarGroup'
import IconText from 'components/shared/IconText'
import { HiOutlineChatAlt2, HiOutlinePaperClip, HiFlag } from 'react-icons/hi'
import { openDialog, updateDialogView, setSelectedTicketId } from './store/stateSlice'
import { useDispatch, useSelector } from 'react-redux'
import { taskLabelColors } from './utils'
import dayjs from 'dayjs'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import UpdateSurvey from '../ProjectList/updateSurvey'
import Survey1 from '../ProjectList/surveyjs'
import { setEditModal, setSelectedTask } from 'store/tasks/project.slice'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const BoardCard = forwardRef((props, ref) => {

	const dispatch = useDispatch()
  const {editModal}=useSelector(state=>state.tasks.projects)
	
	const selectedTab = useSelector(state => state.scrumBoard.state.selectedTab)

	const { listId, cardData, data, ...rest } = props

	const { id, name, comments, attachments, members, dueDate, labels } = data
	const authors = [{
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
	  }
	  ];
	const onCardClick = () => {
		dispatch(setSelectedTask(data))
		dispatch(setEditModal(true))
	}
	console.log(data,"priority_Desc")
	const labelss = authors.find((aut) => aut.name == data?.priority_Desc || aut.id == Number(data?.priority_Desc) )
	console.log(labelss,"labelss")
	return (
		<>
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
							prefixClass={`${taskLabelColors[labelss.name]}`}
						>
							{labelss.text}
						</Tag>
				}
			<h6 className="mb-2">{data?.rr_Desc}</h6>
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
		<Modal open={editModal} onClose={() => dispatch(setEditModal(false))}>
			<div className='grid grid-cols-2 gap-2 '>
				<div><UpdateSurvey/></div>
				<div className="App">
                <h6>Using CKEditor 5 build in React</h6>
                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
				
				<Button>Comment</Button>
            </div>
			</div>
			
		</Modal>
		</>
	)
})

export default BoardCard
