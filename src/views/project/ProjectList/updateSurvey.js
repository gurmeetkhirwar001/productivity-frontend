import "survey-core/defaultV2.min.css";
import { Model, StylesManager } from "survey-core";
import { Survey } from "survey-react-ui";
import { useEffect, useState } from "react";
import { socket } from "utils/socketIO";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Button } from "components/ui";
import { FcImageFile } from "react-icons/fc";
import axios from "axios";
import { setEditModal, settasklist } from "store/tasks/project.slice";
import { bootstrapThemeName } from "survey-core/plugins/bootstrap-integration";
import "survey-core/defaultV2.css";
import * as SurveyCore from "survey-core";
import * as SurveyReact from "survey-react-ui";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import $ from "jquery";
import * as widgets from "surveyjs-widgets";
import "./index.css";
import Uploader from "views/ui-components/common/Uploader";
import { UploadDropBoxFiles } from "services/CloudStorageService";
window["$"] = window["jQuery"] = $;
StylesManager.applyTheme("modern");
// StylesManager.applyTheme("defaultV2");

widgets.ckeditor(SurveyCore);

const options = [
  { value: "one", label: "One" },
  { value: "two", label: "Two", className: "myOptionClassName" },
  {
    type: "group",
    name: "group1",
    items: [
      { value: "three", label: "Three", className: "myOptionClassName" },
      { value: "four", label: "Four" },
    ],
  },
  {
    type: "group",
    name: "group2",
    items: [
      { value: "five", label: "Five" },
      { value: "six", label: "Six" },
    ],
  },
];

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
        { text: "TODO", value: "To Do" },
        { text: "INPROGRESS", value: "In Progress" },
        { text: "QA", value: "Qa" },
        { text: "COMPLETED", value: "Completed" },
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

const self = window;

if (!self.alreadyRendered) {
  const script = document.createElement("script");

  script.src = "https://cdn.ckeditor.com/4.14.1/standard/ckeditor.js";

  document.head.append(script);

  script.onload = function () {
    const CKEDITOR = window.CKEDITOR;

    self.alreadyRendered = true;

    if (self.forceUpdate) self.forceUpdate(); // need only for REACT
  };
}

function UpdateSurvey({ setFile, onSubmit }) {
  const dispatch = useDispatch();
  const { selectedTask } = useSelector(
    (state) => state.tasks.projects
  );
  const survey = new Model(surveyJson);
  // survey.showNavigationButtons = false;
  const options = [
    { value: "uploadfile", label: "Upload File" },
    { value: "googledrive", label: "Google Drive" },
    { value: "dropbox", label: "DropBox" },
    { value: "onedrive", label: "One Drive" },
  ];
  const [buttonvalue, setButtonvalue] = useState("uploadfile");
  const [disabled, setdisabled] = useState(false);

  async function uploadFile(e) {
    if (buttonvalue == "googledrive") {
      console.log(e);
      let file = e;
      const form = new FormData();

      form.append(
        "metadata",
        new Blob(
          [
            JSON.stringify({
              name: file[0].name,
              mimeType: file[0].type,
            }),
          ],
          { type: "application/json" }
        )
      );
      form.append("file", file[0]);

      fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=name,webViewLink,id,mimeType",
        {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + localStorage.getItem("gdrivetoken"),
          }),
          body: form,
        }
      )
        .then((res) => res.json())
        .then((res) => console.log(res));
    } else if (buttonvalue == "dropbox") {
      const res = await UploadDropBoxFiles(e);
      console.log(res, "resss");
    } else if (buttonvalue == "onedrive") {
    } else {
    }
  }
  async function UpdateData() {
    survey.data = {
      TaskName: selectedTask && selectedTask?.taskname,
      taskdescription: selectedTask && selectedTask?.rr_Desc,
      taskstatus: selectedTask && selectedTask?.current_State,
      taskpriorties: selectedTask && selectedTask?.priority_Desc,
      storypoint: selectedTask && selectedTask?.Story_Point,
      shortdescription: selectedTask && selectedTask?.rr_Short_Desc,
      Start_DT: selectedTask && selectedTask?.Start_DT,
      start_TS: selectedTask && selectedTask?.start_TS,
      Due_TS: selectedTask && selectedTask?.Due_TS,
      due_DT: selectedTask && selectedTask?.due_DT,
    };
    survey?.onComplete.add((getData, options) => {
      console.log(getData.data);
      socket.emit("updateTask", {
        id: selectedTask && selectedTask.id,
        tasksname: getData.data.TaskName,
        tasksdescription: getData.data.TaskDescription,
        tasksstatus: getData.data.TaskStatus,
        taskproject: getData.data.taskproject,
        // usercode: user?.user_Code,
        tenantcode: 10181,
        typecode: 1001,
        formcode: 123,
        shortdescription: getData.data.projectshortname,
        projectscript: [{}],
        projectconfig: [{}],
        projectoptions: [{}],
        projectthemes: [{}],
        projectremark: [{}],
        formscript: [{}],
        startdate: getData.data.startdate,
        starttime: getData.data.starttime,
        duedate: getData.data.duedate,
        duettime: getData.data.duettime,
      });
      socket.on("task-message", () => {
        socket.emit("getTask", true);
        socket.on("receive-task", (data) => {
          console.log(data);
          dispatch(settasklist(data.data));
          dispatch(setEditModal(false));
        });
      });
    });
  }
  useEffect(() => {
    async function CheckDrive() {
      if (buttonvalue == "googledrive") {
        if (!localStorage.getItem("gdrivetoken")) {
          alert("Google Drive is not connected");
          setdisabled(true);
        } else {
          setdisabled(false);
        }
      } else if (buttonvalue == "dropbox") {
        if (!localStorage.getItem("dropboxtoken")) {
          alert("DropBox is not connected");
          setdisabled(true);
        } else {
          setdisabled(false);
        }
      } else if (buttonvalue == "onedrive") {
        if (!localStorage.getItem("onedrivetoken")) {
          alert("OneDrive is not connected");
          setdisabled(true);
        } else {
          setdisabled(false);
        }
      }
    }
    async function UpdateData(){
      survey.data = {
        TaskName: selectedTask && selectedTask?.taskname,
        taskdescription: selectedTask && selectedTask?.rr_Desc,
        taskstatus: selectedTask && selectedTask?.current_State,
        taskpriorties: selectedTask && selectedTask?.priority_Desc,
        storypoint: selectedTask && selectedTask?.Story_Point,
        shortdescription: selectedTask && selectedTask?.rr_Short_Desc,
        Start_DT: selectedTask && selectedTask?.Start_DT,
        start_TS: selectedTask && selectedTask?.start_TS,
        Due_TS: selectedTask && selectedTask?.Due_TS,
        due_DT: selectedTask && selectedTask?.due_DT,
      };
      survey?.onComplete.add((getData, options) => {
        console.log(getData.data);
        socket.emit("updateTask", {
          id: selectedTask && selectedTask.id,
          tasksname: getData.data.TaskName,
          tasksdescription: getData.data.TaskDescription,
          tasksstatus: getData.data.TaskStatus,
          taskproject: getData.data.taskproject,
          // usercode: user?.user_Code,
          tenantcode: 10181,
          typecode: 1001,
          formcode: 123,
          shortdescription: getData.data.projectshortname,
          projectscript: [{}],
          projectconfig: [{}],
          projectoptions: [{}],
          projectthemes: [{}],
          projectremark: [{}],
          formscript: [{}],
          startdate: getData.data.startdate,
          starttime: getData.data.starttime,
          duedate: getData.data.duedate,
          duettime: getData.data.duettime,
        });
        socket.on("task-message", () => {
          socket.emit("getTask", true);
          socket.on("receive-task", (data) => {
            console.log(data);
            dispatch(settasklist(data.data));
            dispatch(setEditModal(false));
          });
        });
      });
    }
    UpdateData()
    CheckDrive();
    // uploadFile()
  }, [buttonvalue]);

  return (
    <div className="h-400">
      <>
        <Survey
          model={survey}
          
        />

        <div className="grid grid-rows-1 grid-flow-col gap-1 ">
          <div>
            <h3 className="text-sm">Attachment</h3>{" "}
          </div>
          <div>
            <Dropdown
              onChange={(e) => setButtonvalue(e.value)}
              controlClassName="control-class"
              menuClassName="menu-class"
              value={buttonvalue}
              className="w-1/2"
              placeholder="Add"
              options={options}
              // arrowClassName={"arrowclass"}
            />
          </div>
        </div>

        {
          <div>
            <Uploader onChange={(e) => uploadFile(e)} />
          </div>
        }
      </>
      {/* <div style={{ textAlign: "center" }}>
        <Button size="lg" variant="solid" onClick={() => UpdateData()}>
          Update Task
        </Button>
      </div> */}
    </div>
  );
}

export default UpdateSurvey;
