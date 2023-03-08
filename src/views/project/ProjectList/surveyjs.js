import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { useEffect } from 'react';
import {socket} from "utils/socketIO"
import { useDispatch } from 'react-redux';
import { setCreateModal, settasklist } from 'store/tasks/project.slice';
const surveyJson = {
  elements: [{
    name: "TaskName",
    title: "Enter your Task Name:",
    type: "text",
    isRequired: true
  }, {
    name: "TaskDescription",
    title: "Enter your Task Description:",
    type: "text",
    isRequired: true
  }
  , {
    "type": "dropdown",
    "name": "TaskStatus",
    "title": "Task Status",
    "isRequired": true,
    "choices": [ {text: "TODO",value:1}, {text:"INPROGRESS",value: 2}, {text:"QA",value: 3}, {text:"COMPLETED",value:4}]
  }
 ]
};

function Survey1({setOpen}) {
    const dispatch = useDispatch()
  const survey = new Model(surveyJson);
    useEffect(() => {
        async function submitData(){
            survey?.onComplete.add((senderData,options) => {
                console.log(senderData.data)
                socket.emit('createTask',{
                   
                        'tasksname':senderData.data.TaskName,
                        'tasksdescription':senderData.data.TaskDescription,
                        'tasksstatus':senderData.data.TaskStatus,
                        'taskproject':1,
                })
                socket.on('task-message',() => {
                    socket.emit("getTask", true);
                    socket.on("receive-task", (data) => {
                        console.log(data)
                        dispatch(settasklist(data.data));
                        dispatch(setCreateModal(false))
                        });
                })
                
               
            })
            
        }
        submitData()
    },[])
  return <Survey model={survey}  />;
}

export default Survey1;