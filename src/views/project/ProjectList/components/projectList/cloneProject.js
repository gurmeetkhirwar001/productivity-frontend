import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { useEffect } from 'react';
import {socket} from "utils/socketIO"
import { useDispatch, useSelector } from 'react-redux';
import { setCreateModal, setprojectList, setEditProjectModal,setCloneModal, setEditModal } from 'store/tasks/project.slice';
import { DefaultBody, encryptMessage } from "utils/common";

import useProjectTask from 'utils/hooks/useProjectask';
const surveyJson = {
  elements: [{
    name: "ProjectName",
    title: "Enter your Project Name:",
    type: "text",
    
  },
  {
    name: "projectshortname",
    title: "Enter your Project shortname:",
    type: "text",
    
  },
  {
    name: "projectremark",
    title: "Enter your Project Remark:",
    type: "text",
    
  },
  {
    "name": "startdate",
    "type": "text",
    "title": "Start Date of Project",
    "inputType": "date",
    
  },
  {
    name: "starttime",
    "type": "text",
    "title": "Start time of Project",
    "inputType": "time",
    
  },
  {
    name: "duedate",
    "type": "text",
    "title": "Due Date of Project",
    "inputType": "date",
    
  },
  {
    name: "duetime",
    "type": "text",
    "title": "Due time of Project",
    "inputType": "time",
    
  },


 ]
};

function CloneProject({setOpen}) {
    const {createProjectaction,UpdateProjectaction} = useProjectTask()
  const survey = new Model(surveyJson);
  const {user} = useSelector(state => state.auth)  
  const {  selectedProject  } = useSelector((state) => state.tasks.projects);
    console.log(selectedProject,"selectedProject")
  const dispatch=useDispatch()
    useEffect(() => {
        survey.data = {
            ProjectName: selectedProject && selectedProject?.projectname,
            projectshortname: selectedProject && selectedProject?.projectshortname,
            projectremark: selectedProject && selectedProject?.projectremark,
            taskpriorties: selectedProject && selectedProject?.priority_Desc,
            startdate: selectedProject && selectedProject?.startdate,
            // shortdescription: selectedProject && selectedProject?.rr_Short_Desc,
            starttime: selectedProject && selectedProject?.starttime,
            startdate: selectedProject && selectedProject?.startdate,
            duetime: selectedProject && selectedProject?.duettime,
            duedate: selectedProject && selectedProject?.duedate,
          };

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
                        projectcode: selectedProject.projectcode,
                        projectthemes:[{}],
                        projectremark:[{}],
                        formscript:[{}],
                        startdate:senderData.data.startdate,
                        starttime:senderData.data.starttime,
                        duedate:senderData.data.duedate,
                        duettime:senderData.data.duettime,

                    },
                    usercode:user?.user_Code,
                    event: "projectupdate",
                    action: "update",
                  };
                  const databody = encryptMessage(body);
                const payload = await UpdateProjectaction({body: databody})
                dispatch(setCloneModal(false))
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
                    dispatch(setprojectList(data));
                    dispatch(setEditModal(false))
                    });
               
                
               
            })
            
        }
        submitData()
    },[])
  return <Survey model={survey}  />;
}

export default CloneProject;