import React from 'react';
import 'react-responsive-modal/styles.css';

import { Modal } from 'react-responsive-modal';
import { setCloneModal, setCreateModal } from 'store/tasks/project.slice';
import CreateProject from './createProject';
import { useDispatch, useSelector } from 'react-redux';
import CloneProject from './EditProject';
const CloneProjectModal = ({open, setOpen}) => {
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const {cloneModal}=useSelector(state=>state.tasks.projects)
  // const onOpenModal = () => setOpen(true);
  // const onCloseModal = () => setOpen(false);

  return (
    <div>
      <Modal open={cloneModal} onClose={() => dispatch(setCloneModal(false))} center>
      {/* <div className='container'> */}
          <div className='col-md-6'>
            
            <div className=''>

            </div>
            <CloneProject /></div>
         
     
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default CloneProjectModal 