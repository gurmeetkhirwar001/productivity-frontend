import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { useEffect } from 'react';
import {socket} from "utils/socketIO"
import { useDispatch, useSelector } from 'react-redux';
import { setCreateModal, settasklist } from 'store/tasks/project.slice';
import { DefaultBody, encryptMessage } from "utils/common";

import useProjectTask from 'utils/hooks/useProjectask';
const surveyJson = {
  elements: [{
    name: "ProjectName",
    title: "Enter your Project Name:",
    type: "text",
    isRequired: true
  },
  {
    name: "projectshortname",
    title: "Enter your Project shortname:",
    type: "text",
    isRequired: true
  },
  {
    name: "projectremark",
    title: "Enter your Project Remark:",
    type: "text",
    isRequired: true
  },
  {
    "name": "startdate",
    "type": "text",
    "title": "Start Date of Project",
    "inputType": "date",
    "isRequired": true
  },
  {
    name: "starttime",
    "type": "text",
    "title": "Start time of Project",
    "inputType": "time",
    "isRequired": true
  },
  {
    name: "duedate",
    "type": "text",
    "title": "Due Date of Project",
    "inputType": "date",
    "isRequired": true
  },
  {
    name: "duetime",
    "type": "text",
    "title": "Due time of Project",
    "inputType": "time",
    "isRequired": true
  },


 ]
};

function CreateProject({setOpen}) {
    const {createProjectaction} = useProjectTask()
  const survey = new Model(surveyJson);
  const {user} = useSelector(state => state.auth)   
  const dispatch=useDispatch()
    useEffect(() => {
        async function submitData(){
            survey?.onComplete.add(async (senderData,options) => {
                console.log(senderData.data,"senderData")
                const body = {
                    ...DefaultBody,
                    data: {
                        usercode:user?.user_Code,
                        tenantcode:10181,
                        typecode:1001,
                        formcode:123,
                        projectname:senderData.data.ProjectName,
                        projectshortname:senderData.data.projectshortname,
                        projectscript:[{}],
                        projectconfig:[{}],
                        projectoptions:[{}],
                        projectthemes:[{}],
                        projectremark:[{}],
                        formscript:[{}],
                        startdate:senderData.data.startdate,
                        starttime:senderData.data.starttime,
                        duedate:senderData.data.duedate,
                        duettime:senderData.data.duettime,

                    },
                    usercode:user?.user_Code,
                    event: "projectadd",
                    action: "create",
                  };
                  const databody = encryptMessage(body);
                const payload = await createProjectaction({body: databody})
                console.log(payload,"payload")
                console.log(senderData.data,"???????????????????")
                  const body2 = {
                    ...DefaultBody,
                    data:{
                        usercode: user?.user_Code,
                        tenantcode: 10181
                    },
                    usercode: user?.user_Code,
                    event:'tenantuserprojectlist',
                    action: 'get'
                  }
                  const databody2 = encryptMessage(body2)
                socket.emit("getProject", {
                    body:databody2,
                    token: localStorage.getItem('authtoken')
                });
                socket.on("receive-projects", (data) => {
                    console.log(data,"hahahqwer123456543234566543456")
                    dispatch(settasklist(data));
                    dispatch(setCreateModal(false))
                    });
               
                
               
            })
            
        }
        submitData()
    },[])
  return <Survey model={survey}  />;
}

export default CreateProject;