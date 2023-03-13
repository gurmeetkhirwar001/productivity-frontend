import React from 'react';
import 'react-responsive-modal/styles.css';

import { Modal } from 'react-responsive-modal';
import { setCreateModal,setEditModal } from 'store/tasks/project.slice';
import CreateProject from './createProject';
import { useDispatch, useSelector } from 'react-redux';
import EditProject from './cloneProject';
const EditProjectModal = ({open, setOpen}) => {
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const {editModal}=useSelector(state=>state.tasks.projects)
  // const onOpenModal = () => setOpen(true);
  // const onCloseModal = () => setOpen(false);

  return (
    <div>
      <Modal open={editModal} onClose={() => dispatch(setEditModal(false))} center>
      {/* <div className='container'> */}
          <div className='col-md-6'>
            
            <div className=''>

            </div>
            <EditProject /></div>
         
     
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default EditProjectModal 