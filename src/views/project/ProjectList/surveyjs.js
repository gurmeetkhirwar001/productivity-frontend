import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { useEffect } from "react";
import { socket } from "utils/socketIO";
import { useDispatch, useSelector } from "react-redux";
import { setCreateModal, settasklist } from "store/tasks/project.slice";
import { DefaultBody, encryptMessage } from "utils/common";

const surveyJson = {
  elements: [
    {
      name: "taskname",
      title: "Enter your Task Name:",
      type: "text",
      isRequired: true,
    },
    {
      name: "taskdescription",
      title: "Enter your Task Description:",
      type: "text",
      isRequired: true,
    },
    {
      type: "dropdown",
      name: "taskstatus",
      title: "Task Status",
      isRequired: true,
      choices: [
        { text: "TODO", value: 'To Do' },
        { text: "INPROGRESS", value: 'In Progress' },
        { text: "QA", value: 'Qa' },
        { text: "COMPLETED", value: 'Completed' },
      ],
    },
    {
      type: "dropdown",
      name: "taskpriorties",
      title: "Task Priorties",
      isRequired: true,
      choices: [
        { text: "Low", value: 1 },
        { text: "High", value: 2 },
        { text: "Medium", value: 3 },
      ],
    },
    {
      name: "storypoint",
      title: "Enter your Story Point:",
      type: "text",
      isRequired: true,
    },
    {
      name: "shortdescription",
      title: "Enter your Task Short Description:",
      type: "text",
      isRequired: true,
    },
    {
      name: "Start_DT",
      type: "text",
      title: "Start Date of Task",
      inputType: "date",
      isRequired: true,
    },
    {
      name: "Start_TS",
      type: "text",
      title: "Start time of Task",
      inputType: "time",
      isRequired: true,
    },
    {
      name: "due_DT",
      type: "text",
      title: "Due Date of Task",
      inputType: "date",
      isRequired: true,
    },
    {
      name: "Due_TS",
      type: "text",
      title: "Due time of Task",
      inputType: "time",
      isRequired: true,
    },
  ],
};

function Survey1({ setOpen }) {
  const survey = new Model(surveyJson);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    async function submitData() {
      survey?.onComplete.add((senderData, options) => {
        console.log(senderData.data);
        var d = new Date();
const hours = d.getHours(); // => 9
const minutes = d.getMinutes(); // =>  30
const seconds= d.getSeconds();
        const body = {
          ...DefaultBody,
          data: {
            usercode: user?.user_Code,
            tenant_FK: 10181,
            active: 1,
            fm_Type_FK: 1001,
            form_Mst_FK: 123,
            requested_User:user?.user_Code,
            assign_User_FK:user?.user_Code,
            added_User:user?.user_Code,
            updt_User:user?.user_Code,
            current_State: senderData.data.taskstatus,
            priority_Desc: senderData.data.taskpriorties,
            Story_Point: senderData.data.storypoint,
            rr_Desc: senderData.data.taskdescription,
            rr_Short_Desc: senderData.data.shortdescription,
            Start_DT: senderData.data.Start_DT,
            start_TS: senderData.data.Start_TS,
            Due_TS: senderData.data.Due_TS,
            due_DT: senderData.data.due_DT,
            added_TS: Date.now(),
            rr_URL: window.location.href,
            pm_FK:localStorage.getItem("projectcode"),
            rr_Date: Date.now(),
            added_TS: `${hours}:${minutes}:${seconds}`,
            updt_TS: `${hours}:${minutes}:${seconds}`,
            rr_Script: [
              {
                taskname: senderData.data.taskName,
                current_State: senderData.data.taskstatus,
                priority_Desc: senderData.data.taskpriorties,
                Story_Point: senderData.data.storypoint,
                rr_Desc: senderData.data.taskdescription,
                rr_Short_Desc: senderData.data.shortdescription,
                Start_DT: senderData.data.startdate,
                start_TS: senderData.data.starttime,
                Due_TS: senderData.data.Due_TS,
                due_DT: senderData.data.due_DT,
              },
            ],
          },
          usercode: user?.user_Code,
          event: "taskadd",
          action: "create",
        };
        const databody = encryptMessage(body);

        socket.emit("createTask", {
          body: databody,
          token: localStorage.getItem("authtoken"),
        });
        socket.on("task-message", () => {
          const body2 = {
            ...DefaultBody,
            data: {
              usercode: user?.user_Code,
              tenantcode: 10181,
              projectcode: localStorage.getItem("projectcode"),
            },
            usercode: user?.user_Code,
            event: "userprojecttasklist",
            action: "get",
          };
          const databody2 = encryptMessage(body2);

          socket.emit("getTask", {
            body: databody2,
            token: localStorage.getItem("authtoken"),
          });
          socket.on("receive-task", (data) => {
            console.log(data);
            dispatch(settasklist(data.data));
            dispatch(setCreateModal(false));
          });
        });
      });
    }
    submitData();
  }, []);
  return <Survey model={survey} />;
}

export default Survey1;
