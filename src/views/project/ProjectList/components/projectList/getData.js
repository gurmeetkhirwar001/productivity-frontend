import { io } from "socket.io-client";
import { socket } from "utils/socketIO";
import { DefaultBody, encryptMessage } from "utils/common";
import { da } from "date-fns/locale";

export async function createTask() {
  const createTask = await socket.emit("createTask", {
    tasksname: "BC123213",
    tasksdescription: "hold",
    taskscreatedat: "date()",
    tasksupdatedat: "date()",
    tasksstatus: "donebaby",
    taskproject: 1,
  });
}
export async function createProject() {
  const createPro = await socket.emit("createProject", {
    projectsname: "HoldUPPPPPPPPPPP",
  });
}

export async function getTask(settasklist) {
  socket.emit("getTask", true);
  socket.on("receive-task", (data) => settasklist(data.data));
}

export async function getTaskList(user,projectcode,settasklist) {
  const body2 = {
    ...DefaultBody,
    data: {
      usercode: user?.user_Code,
      tenantcode: 10181,
      projectcode: projectcode
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
  socket.on("receive-task", (data) => settasklist(data));
}
export async function getProjects(user, setprojectList) {
  const body2 = {
    ...DefaultBody,
    data: {
      usercode: user?.user_Code,
      tenantcode: 10181,
    },
    usercode: user?.user_Code,
    event: "tenantuserprojectlist",
    action: "get",
  };
  const databody2 = encryptMessage(body2);
  socket.emit("getProject", {
    body: databody2,
    token: localStorage.getItem("authtoken"),
  });
  socket.on("receive-projects", (data) => setprojectList(data));
}

export async function UpdateTaskStatus(user,senderData, setprojectList) {
  const body2 = {
    ...DefaultBody,
    data: {
      usercode: user?.user_Code,
      pm_FK:localStorage.getItem("projectcode") , 
      tenant_FK:10181,
      current_State:senderData,
      
    },
    usercode: user?.user_Code,
    event: "quicktaskupdate",
    action: "update",
  };
  const databody2 = encryptMessage(body2);
  socket.emit("updateTaskStatus",{ body: databody2,
    token: localStorage.getItem("authtoken")} );
    return databody2
}
export async function UpdateTask(user,senderData, setprojectList) {
  const body2 = {
    ...DefaultBody,
    data: {
      usercode: user?.user_Code,
      pm_FK:localStorage.getItem("projectcode") , 
      tenant_FK:10181,
      current_State:senderData,
      
    },
    usercode: user?.user_Code,
    event: "quicktaskupdate",
    action: "update",
  };
  const databody2 = encryptMessage(body2);
  socket.emit("updateTaskStatus",{ body: databody2,
    token: localStorage.getItem("authtoken")} );
    return databody2
}

export async function UpdateProject() {
  const body2 = {
    ...DefaultBody,
    data: {
      usercode: user?.user_Code,
      pm_FK:localStorage.getItem("projectcode") , 
      tenant_FK:10181,
      current_State:senderData,
      
    },
    usercode: user?.user_Code,
    event: "projectupdate",
    action: "update",
  };
  const databody2 = encryptMessage(body2);
  socket.emit("updateProject",{ body: databody2,
    token: localStorage.getItem("authtoken")} );
    return databody2
}