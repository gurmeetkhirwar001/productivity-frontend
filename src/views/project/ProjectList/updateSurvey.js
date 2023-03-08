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
      name: "TaskName",
      title: "Enter your Task Name:",
      type: "text",
      isRequired: true,
    },
    {
      name: "TaskDescription",
      title: "TaskDescription",
      type: "editor",
      isRequired: true,
    },
    {
      type: "dropdown",
      name: "TaskStatus",
      title: "Task Status",
      isRequired: true,
      choices: [
        { text: "TODO", value: 1 },
        { text: "INPROGRESS", value: 2 },
        { text: "QA", value: 3 },
        { text: "COMPLETED", value: 4 },
      ],
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
  const { selectedTask } = useSelector((state) => state.tasks.projects);
  const survey = new Model(surveyJson);
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

  useEffect(() => {
    async function UpdateData() {
      survey.data = {
        TaskName: selectedTask && selectedTask?.tasksname,
        TaskDescription: selectedTask && selectedTask?.tasksdescription,
        TaskStatus: selectedTask && selectedTask?.tasksstatus,
      };
      survey?.onComplete.add((getData, options) => {
        console.log(getData.data);
        socket.emit("updateTask", {
          id: selectedTask && selectedTask.id,
          tasksname: getData.data.TaskName,
          tasksdescription: getData.data.TaskDescription,
          tasksstatus: getData.data.TaskStatus,
          taskproject: getData.data.taskproject,
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
    UpdateData();
    CheckDrive();
    // uploadFile()
  }, [survey, buttonvalue]);
  return (
    <div className="h-400">
      <>
        <Survey model={survey} />

        <div className="grid grid-rows-1 grid-flow-col gap-1 h-40">
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
              arrowClassName={"arrowclass"}
            />
          </div>
        </div>

        {
          <>
            <h4 className="p-4">Upload File to Google Drive</h4>
            <Uploader onChange={(e) => uploadFile(e)} />
          </>
        }
      </>
    </div>
  );
}

export default UpdateSurvey;
