import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-responsive-modal';
import UpdateSurvey from './updateSurvey';
import { setEditModal } from 'store/tasks/project.slice';
import Customize from 'views/ui-components/forms/Upload/Customize';
const UpdateModal = ({open, setOpen}) => {
  // const [open, setOpen] = useState(false);
  // const onOpenModal = () => setOpen(true);
  // const onCloseModal = () => setOpen(false);
  const dispatch = useDispatch()
  const {editModal}=useSelector(state=>state.tasks.projects)
  return (
    <div>
      {/* <Modal  center>
        <div className='grid grid-cols-2 gap-2'>
          <div>

      <UpdateSurvey />
          </div>

        </div>
      
      
      </Modal> */}
    </div>
  );
};

export default UpdateModal 