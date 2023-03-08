import React from 'react';
import 'react-responsive-modal/styles.css';

import { Modal } from 'react-responsive-modal';
import { setCreateModal } from 'store/tasks/project.slice';
import Survey1 from './surveyjs';
import { useDispatch, useSelector } from 'react-redux';
const Modal1 = ({open, setOpen}) => {
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const {createModal}=useSelector(state=>state.tasks.projects)
  // const onOpenModal = () => setOpen(true);
  // const onCloseModal = () => setOpen(false);

  return (
    <div>
      <Modal open={createModal} onClose={() => dispatch(setCreateModal(false))} center>
      {/* <div className='container'> */}
        <div className='grid grid-cols-2'>
          <div className='col-md-6'>
            
            <div className=''>

            </div>
            <Survey1 /></div>
          <div className='col-md-6'>

            nanan
          </div>
        </div>
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default Modal1 