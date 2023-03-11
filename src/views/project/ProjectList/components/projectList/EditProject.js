import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { useEffect } from 'react';
import {socket} from "utils/socketIO"
import { useDispatch, useSelector } from 'react-redux';
import { setCreateModal, setprojectList, setEditProjectModal, setCloneModal } from 'store/tasks/project.slice';
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
 ]
};

function EditProject({setOpen}) {
    const {createProjectaction,UpdateProjectaction,CloneProjectaction} = useProjectTask()
  const survey = new Model(surveyJson);
  const {user} = useSelector(state => state.auth)  
  const { selectedProject } = useSelector((state) => state.tasks.projects);
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
                        tenantcode:user?.tenant_Code,
                        typecode:selectedProject.typecode,
                        projectcode: selectedProject.projectcode,
                        formcode:123,
                        projectname:senderData.data.ProjectName,
                        projectshortname:senderData.data.projectshortname,
                    },
                    usercode:user?.user_Code,
                    event: "quickprojectclone",
                    action: "create",
                  };
                  const databody = encryptMessage(body);
                const payload = await CloneProjectaction({body: databody})
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
                    dispatch(setprojectList(data.data));
                    dispatch(setEditProjectModal(false))
                    });
               
                
               
            })
            
        }
        submitData()
    },[])
  return <Survey model={survey}  />;
}

export default EditProject;