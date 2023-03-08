import React from 'react';
import 'react-responsive-modal/styles.css';

import { Modal } from 'react-responsive-modal';
import { setCreateModal } from 'store/tasks/project.slice';
import CreateProject from './createProject';
import { useDispatch, useSelector } from 'react-redux';
const CreateProjectModal = ({open, setOpen}) => {
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const {createModal}=useSelector(state=>state.tasks.projects)
  // const onOpenModal = () => setOpen(true);
  // const onCloseModal = () => setOpen(false);

  return (
    <div>
      <Modal open={createModal} onClose={() => dispatch(setCreateModal(false))} center>
      {/* <div className='container'> */}
          <div className='col-md-6'>
            
            <div className=''>

            </div>
            <CreateProject /></div>
         
     
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default CreateProjectModal 