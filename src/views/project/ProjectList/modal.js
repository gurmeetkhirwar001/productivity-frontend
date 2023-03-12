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
      <Modal
        open={createModal}
        onClose={() => dispatch(setCreateModal(false))}
        center
        styles={{
          modal: {
            width: "75%",
            height: "80%",
          },
        }}
      >
        <h2
          style={{
            paddingLeft: 20,
          }}
        >
          New Task
        </h2>
        {/* <div className='container'> */}
        <div className="grid grid-cols-1">
          <div className="col-md-12">
            <Survey1 />
          </div>
        </div>
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default Modal1 